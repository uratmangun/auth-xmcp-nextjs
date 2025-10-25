#!/usr/bin/env fish

# Better Auth Database Setup Script
# This script helps set up the PostgreSQL database for Better Auth

set -l DB_NAME "auth_xmcp"
set -l SCRIPT_DIR (dirname (status --current-filename))
set -l PROJECT_ROOT (dirname $SCRIPT_DIR)
set -l SCHEMA_FILE "$PROJECT_ROOT/database/schema.sql"

echo "🔧 Better Auth Database Setup"
echo "=============================="
echo ""

# Check if PostgreSQL is installed
if not command -v psql > /dev/null
    echo "❌ Error: PostgreSQL is not installed"
    echo "   Install PostgreSQL first:"
    echo "   - macOS: brew install postgresql"
    echo "   - Ubuntu: sudo apt-get install postgresql"
    echo "   - Arch: sudo pacman -S postgresql"
    exit 1
end

echo "✅ PostgreSQL found"
echo ""

# Check if schema file exists
if not test -f $SCHEMA_FILE
    echo "❌ Error: Schema file not found at $SCHEMA_FILE"
    exit 1
end

echo "📄 Schema file found"
echo ""

# Ask for database name
echo "Database name (default: auth_xmcp):"
read -l custom_db_name
if test -n "$custom_db_name"
    set DB_NAME $custom_db_name
end

echo ""
echo "Creating database: $DB_NAME"
echo ""

# Create database
if createdb $DB_NAME 2>/dev/null
    echo "✅ Database '$DB_NAME' created successfully"
else
    echo "⚠️  Database '$DB_NAME' might already exist"
    echo "   Continue with existing database? (y/n)"
    read -l continue_choice
    if test "$continue_choice" != "y"
        echo "Aborted."
        exit 0
    end
end

echo ""
echo "Running schema migration..."
echo ""

# Run schema
if psql $DB_NAME -f $SCHEMA_FILE
    echo ""
    echo "✅ Schema applied successfully"
else
    echo ""
    echo "❌ Error applying schema"
    exit 1
end

echo ""
echo "📊 Database tables created:"
psql $DB_NAME -c "\\dt"

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with:"
echo "   DATABASE_URL=postgresql://\$USER@localhost:5432/$DB_NAME"
echo ""
echo "2. Generate a secret key:"
echo "   openssl rand -base64 32"
echo ""
echo "3. Start the development server:"
echo "   bun run dev"
echo ""
