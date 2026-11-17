describe('config/index', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    process.env.NODE_ENV = 'test'
    process.env.APPLY_QUEUE_ADDRESS = 'apply-queue'
    delete process.env.PUBLISH_POLLING_INTERVAL
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  test('loads with defaults in test env', () => {
    const config = require('../../../app/config')
    expect(config.env).toBe('test')
    expect(config.publishPollingInterval).toBe(5000)
    expect(config.isDev).toBe(false)
    expect(config.isProd).toBe(false)
    expect(config.messageQueues.applyQueue.address).toBe('apply-queue')
  })

  test('derives isProd true for production env', () => {
    process.env.NODE_ENV = 'production'
    jest.resetModules()
    const config = require('../../../app/config')
    expect(config.env).toBe('production')
    expect(config.isProd).toBe(true)
    expect(config.isDev).toBe(false)
  })

  test('honours custom publish polling interval', () => {
    process.env.PUBLISH_POLLING_INTERVAL = '12345'
    jest.resetModules()
    const config = require('../../../app/config')
    expect(config.publishPollingInterval).toBe(12345)
  })
})
