@echo off

node scripts/gui.js
robocopy ./pk_plan-client/build ./pk_plan-server/public /E