echo 'Backing up'
# Backup
rethinkdb dump -c rethinkdb

#Move file
mv rethinkdb_dump* backup

# Add sc3md
# s3cmd sync * s3://nametag_backups
