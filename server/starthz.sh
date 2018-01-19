sleep 8

echo 'Installing packages'
yarn install

echo 'Starting backend'
npm run dev-start
