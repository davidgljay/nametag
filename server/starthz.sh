sleep 7

echo 'Syncing schema'
hz schema apply /usr/app/.hz/schema.toml --connect rethinkdb

echo 'Starting horizon'
npm start
