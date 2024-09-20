const Hapi = require('@hapi/hapi')
const HapiPino = require('hapi-pino')
const Joi = require('joi')
const healthy = require('./routes/healthy.js')
const healthz = require('./routes/healthz.js')

const createServer = () => {
  const server = Hapi.server({
    port: process.env.PORT
  })

  const routes = [].concat(
    healthy,
    healthz
  )

  server.validator(Joi)
  server.route(routes)
  server.register({
    plugin: HapiPino,
    options: {
      logPayload: true,
      level: 'warn'
    }
  })

  return server
}

module.exports = createServer
