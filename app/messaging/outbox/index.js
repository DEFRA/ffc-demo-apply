const config = require('../../config')
const publishPendingClaims = require('./publish-pending')

async function start () {
  setInterval(() => publishPendingClaims(), config.publishPollingInterval)
  console.info('Outbox service running, ready to publish claims')
}

async function stop () {
}

module.exports = { start, stop }
