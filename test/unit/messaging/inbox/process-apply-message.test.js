// Mock create-claim used by process-apply-message to avoid DB wiring
jest.mock('../../../../app/messaging/inbox/create-claim', () => jest.fn())

const createClaim = require('../../../../app/messaging/inbox/create-claim')
const processApplyMessage = require('../../../../app/messaging/inbox/process-apply-message')

describe('messaging/inbox/process-apply-message', () => {
  test('completes message when claim creation succeeds', async () => {
    createClaim.mockResolvedValue()
    const applyReceiver = {
      completeMessage: jest.fn().mockResolvedValue(),
      abandonMessage: jest.fn().mockResolvedValue()
    }
    const message = { body: { claimId: 'C1' } }

    await processApplyMessage(message, applyReceiver)

    expect(createClaim).toHaveBeenCalledWith({ claimId: 'C1' })
    expect(applyReceiver.completeMessage).toHaveBeenCalledWith(message)
    expect(applyReceiver.abandonMessage).not.toHaveBeenCalled()
  })

  test('abandons message when claim creation fails', async () => {
    createClaim.mockRejectedValue(new Error('boom'))
    const applyReceiver = {
      completeMessage: jest.fn().mockResolvedValue(),
      abandonMessage: jest.fn().mockResolvedValue()
    }
    const message = { body: { claimId: 'C2' } }

    await processApplyMessage(message, applyReceiver)

    expect(applyReceiver.abandonMessage).toHaveBeenCalledWith(message)
    expect(applyReceiver.completeMessage).not.toHaveBeenCalled()
  })
})
