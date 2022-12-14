const dbHelper = require('../../../db-helper')
const processApplyMessage = require('../../../../app/messaging/inbox/process-apply-message')
const { models } = require('../../../../app/services/database-service')()

describe('processing claim message', () => {
  const message = {
    body: {
      claimId: 'MINE1',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold', 'silver'],
      email: 'joe.bloggs@defra.gov.uk'
    }
  }

  const claimReceiver = {
    completeMessage: jest.fn(),
    abandonMessage: jest.fn()
  }

  beforeEach(async () => {
    await dbHelper.truncate()
  })

  afterEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await dbHelper.close()
  })

  test('should save valid claim', async () => {
    await processApplyMessage(message, claimReceiver)
    const claims = await models.claims.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(claims.length).toBe(1)
  })

  test('should save valid claim mineTypes', async () => {
    await processApplyMessage(message, claimReceiver)
    const mineTypes = await models.mineTypes.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(mineTypes.length).toBe(2)
    expect(mineTypes.filter(x => x.mineType === 'gold').length).toBe(1)
    expect(mineTypes.filter(x => x.mineType === 'silver').length).toBe(1)
  })

  test('should save valid claim outbox', async () => {
    await processApplyMessage(message, claimReceiver)
    const outbox = await models.outbox.findAll({ where: { claimId: message.body.claimId, published: false }, raw: true })
    expect(outbox.length).toBe(1)
  })

  test('should not save duplicate claim', async () => {
    await processApplyMessage(message, claimReceiver)
    await processApplyMessage(message, claimReceiver)
    const claims = await models.claims.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(claims.length).toBe(1)
  })

  test('should complete valid claim', async () => {
    await processApplyMessage(message, claimReceiver)
    expect(claimReceiver.completeMessage).toHaveBeenCalled()
  })

  test('should abandon invalid claim', async () => {
    message.body = 'not a claim'
    await processApplyMessage(message, claimReceiver)
    expect(claimReceiver.abandonMessage).toHaveBeenCalled()
  })
})
