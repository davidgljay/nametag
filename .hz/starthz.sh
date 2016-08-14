echo 'Syncing schema'
hz set-schema /usr/app/.hz/permissions_schema.toml --connect rethinkdb:28015

echo 'Starting horizon'
hz serve --connect rethinkdb:28015 --bind all /usr/app
