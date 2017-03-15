const fs = require('fs')
const path = require('path')

// Load the typeDefs from the graphql file.
const typeDefs = fs.readFileSync(path.join(__dirname, 'typeDefs.graphql'), 'utf8')

module.exports = typeDefs
