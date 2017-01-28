sleep 4

echo 'Syncing schema'
hz schema apply schema.toml --project-name nametag --connect rethinkdb

echo 'Starting horizon'
node ./src/app
