--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calendar; Type: SCHEMA; Schema: -; Owner: "pk-admin"
--

CREATE SCHEMA calendar;


ALTER SCHEMA calendar OWNER TO "pk-admin";

--
-- Name: options; Type: SCHEMA; Schema: -; Owner: "pk-admin"
--

CREATE SCHEMA options;


ALTER SCHEMA options OWNER TO "pk-admin";

--
-- Name: session; Type: SCHEMA; Schema: -; Owner: "pk-admin"
--

CREATE SCHEMA session;


ALTER SCHEMA session OWNER TO "pk-admin";

--
-- Name: new_enriched_calendar(); Type: FUNCTION; Schema: calendar; Owner: "pk-admin"
--

CREATE FUNCTION calendar.new_enriched_calendar() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_calendar calendar.enriched_calendar%ROWTYPE;
    v_user_uid          calendar.calendar_user.user_uid%TYPE;
    v_share_type        calendar.calendar_user.share_type%TYPE;
BEGIN
    -- insert into the calendar table
    INSERT INTO calendar.calendar (author_uid, is_public, name)
    VALUES (NEW.author_uid, COALESCE(NEW.is_public, false), NEW.name)
    RETURNING calendar.author_uid, calendar.created_at, calendar.is_public, calendar.modified_at, calendar.name, calendar.uid
        INTO v_enriched_calendar.author_uid, v_enriched_calendar.created_at, v_enriched_calendar.is_public, v_enriched_calendar.modified_at, v_enriched_calendar.name, v_enriched_calendar.uid;

    -- iterate over the shared_with JSONB object and insert into the calendar_user table
    FOR v_user_uid, v_share_type IN
        SELECT * FROM jsonb_each_text(COALESCE(NEW.shared_with, '{}'::jsonb))
        LOOP
            INSERT INTO calendar.calendar_user (calendar_uid, share_type, user_uid)
            VALUES (v_enriched_calendar.uid, v_share_type, v_user_uid);
        END LOOP;

    -- set the shared_with field in the enriched_calendar record
    SELECT COALESCE(jsonb_object_agg(calendar_user.user_uid, calendar_user.share_type), '{}'::jsonb)
    INTO v_enriched_calendar.shared_with
    FROM calendar.calendar_user
    WHERE calendar_user.calendar_uid = v_enriched_calendar.uid;

    RETURN v_enriched_calendar;
END;
$$;


ALTER FUNCTION calendar.new_enriched_calendar() OWNER TO "pk-admin";

--
-- Name: update_enriched_calendar(); Type: FUNCTION; Schema: calendar; Owner: "pk-admin"
--

CREATE FUNCTION calendar.update_enriched_calendar() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_calendar calendar.enriched_calendar%ROWTYPE;
BEGIN
    -- update the calendar table with basic fields
    UPDATE
        calendar.calendar
    SET name      = NEW.name,
        is_public = COALESCE(NEW.is_public, calendar.is_public)
    WHERE calendar.uid = NEW.uid
    RETURNING
        calendar.author_uid,
        calendar.created_at,
        calendar.is_public, calendar.modified_at,
        calendar.name,
        calendar.uid
        INTO
            v_enriched_calendar.author_uid,
            v_enriched_calendar.created_at,
            v_enriched_calendar.is_public,
            v_enriched_calendar.modified_at,
            v_enriched_calendar.name,
            v_enriched_calendar.uid;

    -- handle share_type updates if shared_with was provided
    IF NEW.shared_with IS NOT NULL THEN
        -- update existing permissions that are in both old and new shared_with
        UPDATE
            calendar.calendar_user
        SET share_type = updated.share_type
        FROM jsonb_each_text(NEW.shared_with) as updated(user_uid, share_type)
        WHERE calendar_user.calendar_uid = NEW.uid
          AND calendar_user.user_uid = updated.user_uid::uuid
          AND updated.share_type IS NOT NULL;

        -- delete permissions where share_type is null in shared_with
        DELETE
        FROM calendar.calendar_user
        WHERE calendar_user.calendar_uid = NEW.uid
          AND calendar_user.user_uid::uuid IN (SELECT key::uuid
                                               FROM jsonb_each_text(NEW.shared_with)
                                               WHERE value IS NULL);

        -- insert new permissions that don't exist yet (only for non-null share_types)
        INSERT INTO calendar.calendar_user (calendar_uid, user_uid, share_type)
        SELECT v_enriched_calendar.uid,
               new_shares.user_uid::uuid,
               new_shares.share_type
        FROM jsonb_each_text(NEW.shared_with) as new_shares(user_uid, share_type)
        WHERE new_shares.share_type IS NOT NULL
          AND NOT EXISTS(SELECT 1
                         FROM calendar.calendar_user
                         WHERE calendar_user.calendar_uid = v_enriched_calendar.uid
                           AND calendar_user.user_uid = new_shares.user_uid::uuid);
    END IF;

    -- get final shared_with data
    SELECT COALESCE(jsonb_object_agg(calendar_user.user_uid, calendar_user.share_type), '{}'::jsonb)
    INTO
        v_enriched_calendar.shared_with
    FROM calendar.calendar_user
    WHERE calendar_user.calendar_uid = v_enriched_calendar.uid;

    RETURN v_enriched_calendar;
END;
$$;


ALTER FUNCTION calendar.update_enriched_calendar() OWNER TO "pk-admin";

--
-- Name: enriched_user_cleanup(); Type: FUNCTION; Schema: public; Owner: "pk-admin"
--

CREATE FUNCTION public.enriched_user_cleanup() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_user public.enriched_user%ROWTYPE;
BEGIN
    DELETE
    FROM public."user"
    WHERE "user".uid = OLD.uid;

    -- return the correct structure for the enriched user
    SELECT *
    INTO v_enriched_user
    FROM public.enriched_user
    WHERE FALSE; -- we just need the structure, not actual data

    RETURN v_enriched_user;
END;
$$;


ALTER FUNCTION public.enriched_user_cleanup() OWNER TO "pk-admin";

--
-- Name: new_enriched_user(); Type: FUNCTION; Schema: public; Owner: "pk-admin"
--

CREATE FUNCTION public.new_enriched_user() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_user public.enriched_user%ROWTYPE;
BEGIN
    -- insert data into user table
    INSERT INTO public."user" (name, surname)
    VALUES (NEW.name, NEW.surname)
    RETURNING created_at, modified_at, name, surname, uid
        INTO v_enriched_user.created_at, v_enriched_user.modified_at, v_enriched_user.name, v_enriched_user.surname, v_enriched_user.uid;

    -- insert authentication data
    INSERT INTO session.authentication (user_uid, email, password)
    VALUES (v_enriched_user.uid, NEW.email, NEW.password)
    RETURNING email, password
        INTO v_enriched_user.email, v_enriched_user.password;

    -- add user roles
    INSERT INTO public.user_user_role (user_uid, user_role)
    VALUES (v_enriched_user.uid, unnest(NEW.roles));

    -- get roles separately
    SELECT array_agg(user_role)
    INTO v_enriched_user.roles
    FROM public.user_user_role
    WHERE user_uid = v_enriched_user.uid;

    RETURN v_enriched_user;
END;
$$;


ALTER FUNCTION public.new_enriched_user() OWNER TO "pk-admin";

--
-- Name: update_enriched_user(); Type: FUNCTION; Schema: public; Owner: "pk-admin"
--

CREATE FUNCTION public.update_enriched_user() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_user public.enriched_user%ROWTYPE;
BEGIN
    -- update data in user table
    UPDATE public."user"
    SET name    = COALESCE(NEW.name, OLD.name),
        surname = COALESCE(NEW.surname, OLD.surname)
    WHERE "user".uid = NEW.uid
    RETURNING
        created_at,
        modified_at,
        name,
        surname,
        uid
        INTO
            v_enriched_user.created_at,
            v_enriched_user.modified_at,
            v_enriched_user.name,
            v_enriched_user.surname,
            v_enriched_user.uid;

    -- update authentication data if email or password is provided
    IF NEW.email IS DISTINCT FROM OLD.email OR NEW.password IS DISTINCT FROM OLD.password THEN
        UPDATE session.authentication
        SET email    = COALESCE(NEW.email, OLD.email),
            password = COALESCE(NEW.password, OLD.password)
        WHERE authentication.user_uid = NEW.uid
        RETURNING email, password
            INTO v_enriched_user.email, v_enriched_user.password;
    ELSE
        -- if no authentication data is updated, we still need to get the current values
        SELECT email, password
        INTO v_enriched_user.email, v_enriched_user.password
        FROM session.authentication
        WHERE user_uid = NEW.uid;
    END IF;

    -- update user roles if provided and different from current roles
    IF NEW.roles IS DISTINCT FROM OLD.roles AND NEW.roles IS NOT NULL THEN
        -- delete existing roles
        DELETE
        FROM public.user_user_role
        WHERE user_user_role.user_uid = NEW.uid;

        -- insert new roles
        INSERT INTO public.user_user_role (user_uid, user_role)
        SELECT NEW.uid, unnest(NEW.roles);
    END IF;

    -- get roles
    SELECT array_agg(user_role)
    INTO v_enriched_user.roles
    FROM public.user_user_role
    WHERE user_uid = NEW.uid;

    RETURN v_enriched_user;
END;
$$;


ALTER FUNCTION public.update_enriched_user() OWNER TO "pk-admin";

--
-- Name: update_modified_at_timestamp(); Type: FUNCTION; Schema: public; Owner: "pk-admin"
--

CREATE FUNCTION public.update_modified_at_timestamp() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."modified_at" = now();
    RETURN _new;
END;
$$;


ALTER FUNCTION public.update_modified_at_timestamp() OWNER TO "pk-admin";

--
-- Name: enriched_session_cleanup(); Type: FUNCTION; Schema: session; Owner: "pk-admin"
--

CREATE FUNCTION session.enriched_session_cleanup() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_enriched_session session.enriched_session%ROWTYPE;
BEGIN
    DELETE
    FROM session.session
    WHERE session.user_uid = ((OLD.user ->> 'uid')::uuid);

    -- return the correct structure for the enriched session
    SELECT *
    INTO v_enriched_session
    FROM session.enriched_session
    WHERE FALSE; -- we just need the structure, not actual data

    RETURN v_enriched_session;
END;
$$;


ALTER FUNCTION session.enriched_session_cleanup() OWNER TO "pk-admin";

--
-- Name: new_enriched_session(); Type: FUNCTION; Schema: session; Owner: "pk-admin"
--

CREATE FUNCTION session.new_enriched_session() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_session_uid      uuid;
    v_enriched_session session.enriched_session%ROWTYPE;
BEGIN
    INSERT INTO session.session (user_uid)
    VALUES ((NEW.user ->> 'uid')::uuid)
    RETURNING uid INTO v_session_uid;

    SELECT *
    INTO v_enriched_session
    FROM session.enriched_session
    WHERE enriched_session.uid = v_session_uid;

    RETURN v_enriched_session;
END;
$$;


ALTER FUNCTION session.new_enriched_session() OWNER TO "pk-admin";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calendar; Type: TABLE; Schema: calendar; Owner: "pk-admin"
--

CREATE TABLE calendar.calendar
(
    author_uid  uuid                                                  NOT NULL,
    created_at  timestamp without time zone DEFAULT now()             NOT NULL,
    is_public   boolean                     DEFAULT false             NOT NULL,
    modified_at timestamp without time zone DEFAULT now()             NOT NULL,
    name        character varying                                     NOT NULL,
    uid         uuid                        DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE calendar.calendar
    OWNER TO "pk-admin";

--
-- Name: calendar_user; Type: TABLE; Schema: calendar; Owner: "pk-admin"
--

CREATE TABLE calendar.calendar_user
(
    calendar_uid uuid,
    share_type   character varying              NOT NULL,
    uid          uuid DEFAULT gen_random_uuid() NOT NULL,
    user_uid     uuid                           NOT NULL
);


ALTER TABLE calendar.calendar_user
    OWNER TO "pk-admin";

--
-- Name: enriched_calendar; Type: VIEW; Schema: calendar; Owner: "pk-admin"
--

CREATE VIEW calendar.enriched_calendar AS
SELECT author_uid,
       created_at,
       is_public,
       modified_at,
       name,
       COALESCE((SELECT jsonb_object_agg(calendar_user.user_uid, calendar_user.share_type) AS jsonb_object_agg
                 FROM calendar.calendar_user
                 WHERE (calendar_user.calendar_uid = calendar.uid)), '{}'::jsonb) AS shared_with,
       uid
FROM calendar.calendar;


ALTER VIEW calendar.enriched_calendar OWNER TO "pk-admin";

--
-- Name: event; Type: TABLE; Schema: calendar; Owner: "pk-admin"
--

CREATE TABLE calendar.event
(
    author_uid   uuid                                                               NOT NULL,
    calendar_uid uuid                                                               NOT NULL,
    created_at   timestamp without time zone DEFAULT now()                          NOT NULL,
    description  character varying,
    end_date     timestamp with time zone    DEFAULT (now() + '01:00:00'::interval) NOT NULL,
    location     character varying,
    modified_at  timestamp without time zone DEFAULT now()                          NOT NULL,
    start_date   timestamp with time zone    DEFAULT now()                          NOT NULL,
    title        character varying                                                  NOT NULL,
    uid          uuid                        DEFAULT gen_random_uuid()              NOT NULL
);


ALTER TABLE calendar.event
    OWNER TO "pk-admin";

--
-- Name: share_type; Type: TABLE; Schema: options; Owner: "pk-admin"
--

CREATE TABLE options.share_type
(
    value character varying NOT NULL
);


ALTER TABLE options.share_type
    OWNER TO "pk-admin";

--
-- Name: user_role; Type: TABLE; Schema: options; Owner: "pk-admin"
--

CREATE TABLE options.user_role
(
    value character varying NOT NULL
);


ALTER TABLE options.user_role
    OWNER TO "pk-admin";

--
-- Name: user; Type: TABLE; Schema: public; Owner: "pk-admin"
--

CREATE TABLE public."user"
(
    created_at  timestamp without time zone DEFAULT now()             NOT NULL,
    modified_at timestamp without time zone DEFAULT now()             NOT NULL,
    name        character varying                                     NOT NULL,
    surname     character varying                                     NOT NULL,
    uid         uuid                        DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public."user"
    OWNER TO "pk-admin";

--
-- Name: user_user_role; Type: TABLE; Schema: public; Owner: "pk-admin"
--

CREATE TABLE public.user_user_role
(
    uid       uuid DEFAULT gen_random_uuid() NOT NULL,
    user_role character varying              NOT NULL,
    user_uid  uuid                           NOT NULL
);


ALTER TABLE public.user_user_role
    OWNER TO "pk-admin";

--
-- Name: authentication; Type: TABLE; Schema: session; Owner: "pk-admin"
--

CREATE TABLE session.authentication
(
    email       character varying                                     NOT NULL,
    created_at  timestamp without time zone DEFAULT now()             NOT NULL,
    modified_at timestamp without time zone DEFAULT now()             NOT NULL,
    password    bytea                                                 NOT NULL,
    user_uid    uuid                                                  NOT NULL,
    uid         uuid                        DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE session.authentication
    OWNER TO "pk-admin";

--
-- Name: enriched_user; Type: VIEW; Schema: public; Owner: "pk-admin"
--

CREATE VIEW public.enriched_user AS
SELECT "user".created_at,
       authentication.email,
       "user".modified_at,
       "user".name,
       COALESCE((SELECT array_agg(user_user_role_1.user_role) AS array_agg
                 FROM public.user_user_role user_user_role_1
                 WHERE (user_user_role_1.user_uid = "user".uid)), ARRAY []::character varying[]) AS roles,
       authentication.password,
       "user".surname,
       "user".uid
FROM (public."user"
    JOIN session.authentication ON ((authentication.user_uid = "user".uid)));


ALTER VIEW public.enriched_user OWNER TO "pk-admin";

--
-- Name: full_user; Type: VIEW; Schema: public; Owner: "pk-admin"
--

CREATE VIEW public.full_user AS
SELECT created_at,
       email,
       modified_at,
       name,
       roles,
       surname,
       uid
FROM public.enriched_user;


ALTER VIEW public.full_user OWNER TO "pk-admin";

--
-- Name: session; Type: TABLE; Schema: session; Owner: "pk-admin"
--

CREATE TABLE session.session
(
    created_at  timestamp without time zone DEFAULT now()                       NOT NULL,
    expires_at  timestamp without time zone DEFAULT (now() + '1 day'::interval) NOT NULL,
    modified_at timestamp without time zone DEFAULT now()                       NOT NULL,
    uid         uuid                        DEFAULT gen_random_uuid()           NOT NULL,
    user_uid    uuid                                                            NOT NULL
);


ALTER TABLE session.session
    OWNER TO "pk-admin";

--
-- Name: enriched_session; Type: VIEW; Schema: session; Owner: "pk-admin"
--

CREATE VIEW session.enriched_session AS
SELECT session.created_at,
       session.expires_at,
       session.uid,
       row_to_json(full_user.*) AS "user"
FROM (session.session
    JOIN public.full_user ON ((full_user.uid = session.user_uid)))
WHERE (session.expires_at > now());


ALTER VIEW session.enriched_session OWNER TO "pk-admin";

--
-- Data for Name: share_type; Type: TABLE DATA; Schema: options; Owner: "pk-admin"
--

COPY options.share_type (value) FROM stdin;
editor
viewer
\.

--
-- Data for Name: user_role; Type: TABLE DATA; Schema: options; Owner: "pk-admin"
--

COPY options.user_role (value) FROM stdin;
admin
member
\.

--
-- Name: calendar calendar_pk; Type: CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar
    ADD CONSTRAINT calendar_pk PRIMARY KEY (uid);


--
-- Name: calendar_user calendar_user_pk; Type: CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar_user
    ADD CONSTRAINT calendar_user_pk PRIMARY KEY (uid);


--
-- Name: event event_pk; Type: CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.event
    ADD CONSTRAINT event_pk PRIMARY KEY (uid);


--
-- Name: calendar name_unique; Type: CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar
    ADD CONSTRAINT name_unique UNIQUE (name);


--
-- Name: share_type share_type_pk; Type: CONSTRAINT; Schema: options; Owner: "pk-admin"
--

ALTER TABLE ONLY options.share_type
    ADD CONSTRAINT share_type_pk PRIMARY KEY (value);


--
-- Name: user_role user_role_pk; Type: CONSTRAINT; Schema: options; Owner: "pk-admin"
--

ALTER TABLE ONLY options.user_role
    ADD CONSTRAINT user_role_pk PRIMARY KEY (value);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: "pk-admin"
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (uid);


--
-- Name: user_user_role user_user_role_pk; Type: CONSTRAINT; Schema: public; Owner: "pk-admin"
--

ALTER TABLE ONLY public.user_user_role
    ADD CONSTRAINT user_user_role_pk PRIMARY KEY (uid);


--
-- Name: authentication authentication_pk; Type: CONSTRAINT; Schema: session; Owner: "pk-admin"
--

ALTER TABLE ONLY session.authentication
    ADD CONSTRAINT authentication_pk PRIMARY KEY (uid);


--
-- Name: authentication email_unique; Type: CONSTRAINT; Schema: session; Owner: "pk-admin"
--

ALTER TABLE ONLY session.authentication
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: session session_pk; Type: CONSTRAINT; Schema: session; Owner: "pk-admin"
--

ALTER TABLE ONLY session.session
    ADD CONSTRAINT session_pk PRIMARY KEY (uid);


--
-- Name: enriched_calendar enriched_calendar_insert; Type: TRIGGER; Schema: calendar; Owner: "pk-admin"
--

CREATE TRIGGER enriched_calendar_insert
    INSTEAD OF INSERT
    ON calendar.enriched_calendar
    FOR EACH ROW
EXECUTE FUNCTION calendar.new_enriched_calendar();


--
-- Name: enriched_calendar enriched_calendar_update; Type: TRIGGER; Schema: calendar; Owner: "pk-admin"
--

CREATE TRIGGER enriched_calendar_update
    INSTEAD OF UPDATE
    ON calendar.enriched_calendar
    FOR EACH ROW
EXECUTE FUNCTION calendar.update_enriched_calendar();


--
-- Name: calendar set_modified_at; Type: TRIGGER; Schema: calendar; Owner: "pk-admin"
--

CREATE TRIGGER set_modified_at
    BEFORE UPDATE
    ON calendar.calendar
    FOR EACH ROW
EXECUTE FUNCTION public.update_modified_at_timestamp();


--
-- Name: event set_modified_at; Type: TRIGGER; Schema: calendar; Owner: "pk-admin"
--

CREATE TRIGGER set_modified_at
    BEFORE UPDATE
    ON calendar.event
    FOR EACH ROW
EXECUTE FUNCTION public.update_modified_at_timestamp();


--
-- Name: enriched_user enriched_user_delete; Type: TRIGGER; Schema: public; Owner: "pk-admin"
--

CREATE TRIGGER enriched_user_delete
    INSTEAD OF DELETE
    ON public.enriched_user
    FOR EACH ROW
EXECUTE FUNCTION public.enriched_user_cleanup();


--
-- Name: enriched_user enriched_user_insert; Type: TRIGGER; Schema: public; Owner: "pk-admin"
--

CREATE TRIGGER enriched_user_insert
    INSTEAD OF INSERT
    ON public.enriched_user
    FOR EACH ROW
EXECUTE FUNCTION public.new_enriched_user();


--
-- Name: enriched_user enriched_user_update; Type: TRIGGER; Schema: public; Owner: "pk-admin"
--

CREATE TRIGGER enriched_user_update
    INSTEAD OF UPDATE
    ON public.enriched_user
    FOR EACH ROW
EXECUTE FUNCTION public.update_enriched_user();


--
-- Name: user set_modified_at; Type: TRIGGER; Schema: public; Owner: "pk-admin"
--

CREATE TRIGGER set_modified_at
    BEFORE UPDATE
    ON public."user"
    FOR EACH ROW
EXECUTE FUNCTION public.update_modified_at_timestamp();


--
-- Name: enriched_session enriched_session_delete; Type: TRIGGER; Schema: session; Owner: "pk-admin"
--

CREATE TRIGGER enriched_session_delete
    INSTEAD OF DELETE
    ON session.enriched_session
    FOR EACH ROW
EXECUTE FUNCTION session.enriched_session_cleanup();


--
-- Name: enriched_session enriched_session_insert; Type: TRIGGER; Schema: session; Owner: "pk-admin"
--

CREATE TRIGGER enriched_session_insert
    INSTEAD OF INSERT
    ON session.enriched_session
    FOR EACH ROW
EXECUTE FUNCTION session.new_enriched_session();


--
-- Name: authentication set_modified_at; Type: TRIGGER; Schema: session; Owner: "pk-admin"
--

CREATE TRIGGER set_modified_at
    BEFORE UPDATE
    ON session.authentication
    FOR EACH ROW
EXECUTE FUNCTION public.update_modified_at_timestamp();


--
-- Name: session set_modified_at; Type: TRIGGER; Schema: session; Owner: "pk-admin"
--

CREATE TRIGGER set_modified_at
    BEFORE UPDATE
    ON session.session
    FOR EACH ROW
EXECUTE FUNCTION public.update_modified_at_timestamp();


--
-- Name: event calendar_uid_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.event
    ADD CONSTRAINT calendar_uid_fk FOREIGN KEY (calendar_uid) REFERENCES calendar.calendar (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendar_user calendar_user_calendar_uid_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar_user
    ADD CONSTRAINT calendar_user_calendar_uid_fk FOREIGN KEY (calendar_uid) REFERENCES calendar.calendar (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendar_user calendar_user_share_type_value_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar_user
    ADD CONSTRAINT calendar_user_share_type_value_fk FOREIGN KEY (share_type) REFERENCES options.share_type (value) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendar_user calendar_user_user_uid_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar_user
    ADD CONSTRAINT calendar_user_user_uid_fk FOREIGN KEY (user_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendar user_uid_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.calendar
    ADD CONSTRAINT user_uid_fk FOREIGN KEY (author_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event user_uid_fk; Type: FK CONSTRAINT; Schema: calendar; Owner: "pk-admin"
--

ALTER TABLE ONLY calendar.event
    ADD CONSTRAINT user_uid_fk FOREIGN KEY (author_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_user_role user_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: "pk-admin"
--

ALTER TABLE ONLY public.user_user_role
    ADD CONSTRAINT user_role_fk FOREIGN KEY (user_role) REFERENCES options.user_role (value) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_user_role user_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: "pk-admin"
--

ALTER TABLE ONLY public.user_user_role
    ADD CONSTRAINT user_uid_fk FOREIGN KEY (user_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authentication authentication_user_uid_fk; Type: FK CONSTRAINT; Schema: session; Owner: "pk-admin"
--

ALTER TABLE ONLY session.authentication
    ADD CONSTRAINT authentication_user_uid_fk FOREIGN KEY (user_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session user_uid_fk; Type: FK CONSTRAINT; Schema: session; Owner: "pk-admin"
--

ALTER TABLE ONLY session.session
    ADD CONSTRAINT user_uid_fk FOREIGN KEY (user_uid) REFERENCES public."user" (uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

