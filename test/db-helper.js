const { models, sequelize } = require('../app/services/database-service')()

async function truncate () {
  await models.mineTypes.destroy({ truncate: { cascade: true } })
  await models.outbox.destroy({ truncate: { cascade: true } })
  await models.claims.destroy({ truncate: { cascade: true } })
}

async function createClaimRecords (claims) {
  await models.claims.bulkCreate(claims)
}

async function createOutboxRecords (outbox) {
  await models.outbox.bulkCreate(outbox)
}

async function createMineTypeRecords (mineTypes) {
  await models.mineTypes.bulkCreate(mineTypes)
}

async function close () {
  await sequelize.close()
}

module.exports = {
  close,
  createClaimRecords,
  createMineTypeRecords,
  createOutboxRecords,
  truncate
}
