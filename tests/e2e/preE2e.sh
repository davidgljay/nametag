# fail the e2e if any of these fail
set -e

docker-compose up -d

# install selenium
selenium-standalone install --config=./selenium.config.js
