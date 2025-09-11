describe('config/mq-config', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    process.env.NODE_ENV = 'test'
    delete process.env.APPLY_QUEUE_ADDRESS
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  test('throws when APPLY_QUEUE_ADDRESS is missing', () => {
    expect(() => require('../../../app/config/mq-config')).toThrow(/message queue config is invalid/i)
  })

  test('provides defaults when APPLY_QUEUE_ADDRESS is present', () => {
    process.env.APPLY_QUEUE_ADDRESS = 'apply-queue'
    const mq = require('../../../app/config/mq-config')
    expect(mq.applyQueue.address).toBe('apply-queue')
  })
})
