describe('server', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.PORT = '0'
  })

  test('registers health routes', async () => {
    const createServer = require('../../app/server')
    const server = await createServer()
    const routes = server.table().flatMap(t => t.table ? t.table : [t])
    const paths = routes.map(r => r.path)
    expect(paths).toContain('/healthy')
    expect(paths).toContain('/healthz')
  })
})
