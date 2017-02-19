echo 'Backing up'
# Backup
rethinkdb dump -c rethinkdb

#Move file
mv rethinkdb_dump* backup

#TODO Add sc3md
