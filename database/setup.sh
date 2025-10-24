#!/bin/bash
# Database Setup Script for Linux/Mac
# Initializes SQLite database for Eventrix

echo ""
echo "========================================"
echo "   Eventrix Database Setup (Unix)"
echo "========================================"
echo ""

cd "$(dirname "$0")"

if [ -f "eventrix.db" ]; then
    echo "⚠️  WARNING: Database already exists!"
    echo "   Delete eventrix.db to recreate it."
    echo ""
    exit 0
fi

# Check if sqlite3 is available
if ! command -v sqlite3 &> /dev/null; then
    echo "❌ ERROR: sqlite3 command not found!"
    echo ""
    echo "Please install SQLite3:"
    echo "  Ubuntu/Debian: sudo apt-get install sqlite3"
    echo "  Mac: brew install sqlite3 (or it may be pre-installed)"
    echo "  Fedora: sudo dnf install sqlite"
    echo ""
    exit 1
fi

echo "📝 Creating database tables..."
sqlite3 eventrix.db < schema_sqlite.sql
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to create tables"
    exit 1
fi
echo "✅ Tables created"

echo ""
echo "📊 Inserting sample data..."
sqlite3 eventrix.db < sample_data_sqlite.sql
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to insert data"
    exit 1
fi
echo "✅ Sample data inserted"

echo ""
echo "========================================"
echo "    Database setup complete!"
echo "========================================"
echo ""
echo "📍 Database location: database/eventrix.db"
echo ""
echo "🚀 You can now run: npm run dev"
echo ""
