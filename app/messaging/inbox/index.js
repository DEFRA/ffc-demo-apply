const config = require('../../config')
const mqConfig = config.messageQueues.applyQueue
const processApplyMessage = require('./process-apply-message')
const { MessageReceiver } = require('ffc-messaging')
let applyReceiver

async function start () {
  const applyAction = message => processApplyMessage(message, applyReceiver)
  applyReceiver = new MessageReceiver(mqConfig, applyAction)
  await applyReceiver.subscribe()
  console.info('Inbox service running, ready to receive claims')
}

async function stop () {
  await applyReceiver.closeConnection()
}

module.exports = { start, stop }
