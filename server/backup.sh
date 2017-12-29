echo 'Backing up'
# Backup
rethinkdb dump -c rethinkdb

#Move file
mv rethinkdb_dump* backup

# Add sc3md
s3cmd -c /usr/nametag/.s3cfg sync * s3://nametag_backups
