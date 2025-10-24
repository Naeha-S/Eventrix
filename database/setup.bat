@echo off
REM Database Setup Script for Windows
REM Initializes SQLite database for Eventrix

echo.
echo ========================================
echo    Eventrix Database Setup (Windows)
echo ========================================
echo.

cd database

if exist eventrix.db (
    echo WARNING: Database already exists!
    echo Delete eventrix.db to recreate it.
    echo.
    pause
    exit /b 0
)

REM Check if sqlite3 is available
where sqlite3 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: sqlite3 command not found!
    echo.
    echo Please install SQLite:
    echo 1. Download from https://www.sqlite.org/download.html
    echo 2. Extract sqlite3.exe to a folder in your PATH
    echo 3. Run this script again
    echo.
    echo OR use DB Browser for SQLite:
    echo https://sqlitebrowser.org/
    echo.
    pause
    exit /b 1
)

echo Creating database tables...
sqlite3 eventrix.db < schema_sqlite.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create tables
    pause
    exit /b 1
)
echo ✓ Tables created

echo.
echo Inserting sample data...
sqlite3 eventrix.db < sample_data_sqlite.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to insert data
    pause
    exit /b 1
)
echo ✓ Sample data inserted

echo.
echo ========================================
echo    Database setup complete!
echo ========================================
echo.
echo Database location: database\eventrix.db
echo.
echo You can now run: npm run dev
echo.
pause
