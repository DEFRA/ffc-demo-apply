jest.mock('../../../../app/messaging/outbox/get-pending-claims', () => jest.fn())
jest.mock('../../../../app/messaging/outbox/update-published', () => jest.fn())

const getPendingClaims = require('../../../../app/messaging/outbox/get-pending-claims')
const updatePublished = require('../../../../app/messaging/outbox/update-published')
const publishPending = require('../../../../app/messaging/outbox/publish-pending')

describe('messaging/outbox/publish-pending', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('publishes all pending claims', async () => {
    getPendingClaims.mockResolvedValue([
      { claimId: 'A' },
      { claimId: 'B' }
    ])
    updatePublished.mockResolvedValue()

    await publishPending()

    expect(getPendingClaims).toHaveBeenCalled()
    expect(updatePublished).toHaveBeenCalledTimes(2)
    expect(updatePublished).toHaveBeenNthCalledWith(1, 'A')
    expect(updatePublished).toHaveBeenNthCalledWith(2, 'B')
  })
})
