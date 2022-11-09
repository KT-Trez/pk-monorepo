@echo off

(heroku container:push web -a pkplan && heroku container:release web -a pkplan)