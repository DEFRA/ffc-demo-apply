require('./insights').setup()
const createServer = require('./server')
const inbox = require('./messaging/inbox')
const outbox = require('./messaging/outbox')

process.on('SIGTERM', async function () {
  await inbox.stop()
  await outbox.stop()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await inbox.stop()
  await outbox.stop()
  process.exit(0)
})

const init = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

module.exports = (async function startService () {
  await inbox.start()
  await outbox.start()
  init()
}())
