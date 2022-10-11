const createClaim = require('./create-claim')

async function processApplyMessage (message, applyReceiver) {
  try {
    await createClaim(message.body)
    await applyReceiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await applyReceiver.abandonMessage(message)
  }
}

module.exports = processApplyMessage
