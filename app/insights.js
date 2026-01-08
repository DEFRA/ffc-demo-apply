const appInsights = require('applicationinsights')

const setup = () => {
  if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
    appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING).start()
    console.log('App Insights running')
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
    appInsights.defaultClient.addTelemetryProcessor((envelope, context) => {
      const data = envelope.data.baseData
      if (data.url && data.url.includes('healthz')) {
        return false
      }
      return true
    })
  } else {
    console.log('App Insights not running')
  }
}

module.exports = { setup }
