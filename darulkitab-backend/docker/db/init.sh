#!/bin/bash
# This script runs at Docker MariaDB first boot.
# It imports the production dump into the local "darulkitab_db" database,
# replacing the production DB name with the local one.

DB_FILE="/docker-entrypoint-initdb.d/prod-dump.sql"

if [ -f "$DB_FILE" ]; then
  echo "Importing production DB dump into darulkitab_db..."
  # Replace production DB name with local DB name, then pipe to mysql
  sed 's/u484303972_darulkitab_db/darulkitab_db/g' "$DB_FILE" \
    | mysql -u root -proot darulkitab_db
  echo "Import complete."
fi
