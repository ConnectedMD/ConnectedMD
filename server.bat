@echo off
cd cordova
call gulp build
cd..
call node server.js port=%1 api=http://localhost:8080/