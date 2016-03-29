@echo off
cd cordova
call gulp build
cd..
call node server.js api=http://localhost:8080/