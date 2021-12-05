@echo off
cls

:top
echo.
echo Starting...
echo.
PowerShell -NoProfile -Command "& {Start-Process PowerShell -ArgumentList '-NoProfile -windowstyle hidden -File ""%~dp0startServer.ps1""' -Verb RunAs}"
echo Done!
cd "F:\courses\WebDevelopment FWD\projects\work\shop-sales\frontend"
yarn start