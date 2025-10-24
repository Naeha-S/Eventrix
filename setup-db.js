#!/usr/bin/env node

/**
 * Database Initialization Script
 * Automatically sets up SQLite database for local development
 */

const fs = require('fs');
const path = require('path');

console.log('🗄️  Eventrix Database Setup\n');

// Check if sqlite3 is available
const hasSqlite3 = (() => {
    try {
        require('child_process').execSync('sqlite3 --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
})();

const dbPath = path.join(__dirname, 'database', 'eventrix.db');
const schemaPath = path.join(__dirname, 'database', 'schema_sqlite.sql');
const dataPath = path.join(__dirname, 'database', 'sample_data_sqlite.sql');

// Check if database already exists
if (fs.existsSync(dbPath)) {
    console.log('⚠️  Database already exists at:', dbPath);
    console.log('   To recreate, delete the file and run this script again.\n');
    process.exit(0);
}

// Check if schema files exist
if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found:', schemaPath);
    process.exit(1);
}

if (!fs.existsSync(dataPath)) {
    console.error('❌ Data file not found:', dataPath);
    process.exit(1);
}

if (!hasSqlite3) {
    console.log('⚠️  SQLite3 command-line tool not found.\n');
    console.log('📋 Manual Setup Instructions:\n');
    console.log('   Windows:');
    console.log('   1. Download SQLite from https://www.sqlite.org/download.html');
    console.log('   2. Extract sqlite3.exe to a folder in your PATH');
    console.log('   3. Run: cd database && sqlite3 eventrix.db < schema_sqlite.sql\n');
    console.log('   Or use DB Browser for SQLite (https://sqlitebrowser.org/)\n');
    console.log('   Mac/Linux:');
    console.log('   SQLite3 is usually pre-installed. Try:');
    console.log('   cd database && sqlite3 eventrix.db < schema_sqlite.sql\n');
    process.exit(1);
}

try {
    const { execSync } = require('child_process');
    
    console.log('📝 Creating database tables...');
    execSync(`sqlite3 "${dbPath}" < "${schemaPath}"`, { 
        stdio: 'pipe',
        cwd: __dirname 
    });
    console.log('✅ Tables created successfully\n');
    
    console.log('📊 Inserting sample data...');
    execSync(`sqlite3 "${dbPath}" < "${dataPath}"`, { 
        stdio: 'pipe',
        cwd: __dirname 
    });
    console.log('✅ Sample data inserted successfully\n');
    
    // Verify
    const result = execSync(`sqlite3 "${dbPath}" "SELECT COUNT(*) FROM Users;"`, { 
        encoding: 'utf-8' 
    }).trim();
    
    console.log('🎉 Database setup complete!\n');
    console.log('📍 Database location:', dbPath);
    console.log(`👥 Total users: ${result}`);
    console.log('\n🚀 You can now run: npm run dev\n');
    
} catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n📋 Try manual setup:');
    console.log(`   cd database`);
    console.log(`   sqlite3 eventrix.db < schema_sqlite.sql`);
    console.log(`   sqlite3 eventrix.db < sample_data_sqlite.sql\n`);
    process.exit(1);
}
