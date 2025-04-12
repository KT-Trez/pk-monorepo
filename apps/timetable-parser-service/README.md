# @pk/timetable-parser-service

This is a service that parses the timetable from the university website and uploads it to the remote server.

## Environment variables

| Name                     | Description                                            |
|--------------------------|--------------------------------------------------------|
| `npm_package_version`    | The version of the package.                            |
| `UPLOAD`                 | Whether to upload the  parsed timetable to the server. |
| `UPLOAD_SERVER_USERNAME` | The ssh username for the server.                       |
| `UPLOAD_SERVER_PASSWORD` | The ssh password for the server.                       |