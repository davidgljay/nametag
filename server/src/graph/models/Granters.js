const r = require('rethinkdb')
// const errors = require('../../errors')

const grantersTable = r.db('nametag').table('granters')

/**
 * Returns a badge granter from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => grantersTable.get(id).run(conn)

/**
 * Returns a badge granter from a url code.
 *
 * @param {Object} context     graph context
 * @param {String} urlCode   the urlCode of the badge to be retrieved
 *
 */

const getByUrlCode = ({conn}, urlCode) => grantersTable.getAll(urlCode, {index:'urlCode'}).run(conn)
  .then(cursor => cursor.next())


/**
 * Creates a badge granter
 *
 * @param {Object} context     graph context
 * @param {Object} granter   the badge granter to be created
 *
 **/

const create = ({conn}, granter) => {
  const template = Object.assign({}, granter, {createdAt: new Date(), updatedAt: new Date()})
  return grantersTable.insert(template).run(conn)
    .then(res => {
      if (res.error) {
        return new Error(res.error)
      }
      return Object.assign({}, granter, {id: res.generated_keys[0]})
    })
}

module.exports = (context) => ({
  Granters: {
    get: id => get(context, id),
    create: badge => create(context, badge),
    getByUrlCode: urlCode => getByUrlCode(context, urlCode)
  }
})
