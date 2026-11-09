@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal
if exist "C:\Users\dell\apache-maven-3.9.9\bin\mvn.cmd" (
    call "C:\Users\dell\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    call mvn %*
)
exit /b %ERRORLEVEL%
