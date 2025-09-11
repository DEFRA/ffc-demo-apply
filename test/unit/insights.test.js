jest.mock('applicationinsights', () => {
  const tags = {}
  const keys = { cloudRole: 'cloudRole' }
  const defaultClient = { context: { keys, tags } }
  const start = jest.fn().mockReturnThis()
  const setup = jest.fn(() => ({ start }))
  return { defaultClient, setup }
})

const appInsights = require('applicationinsights')
const { setup } = require('../../app/insights')

describe('insights setup', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
    jest.clearAllMocks()
  })

  test('starts and sets cloud role when connection string present', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'InstrumentationKey=fake'
    process.env.APPINSIGHTS_CLOUDROLE = 'ffc-demo-apply'
    setup()
    expect(appInsights.setup).toHaveBeenCalled()
    expect(appInsights.defaultClient.context.tags.cloudRole).toBe('ffc-demo-apply')
  })

  test('does not start when no connection string', () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    setup()
    expect(appInsights.setup).not.toHaveBeenCalled()
  })
})
