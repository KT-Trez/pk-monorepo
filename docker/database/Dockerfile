FROM postgres:17-alpine

# install pg_cron extension
RUN apk add --no-cache --update postgresql-contrib postgresql-pg_cron

COPY ./docker/database/init.sql /docker-entrypoint-initdb.d/init.sql
COPY ./docker/database/postgresql.conf /etc/postgresql/postgresql.conf

# start PostgreSQL with custom config file
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
