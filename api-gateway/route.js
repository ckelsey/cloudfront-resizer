const Config = require('../config')
const api = `${Config.AppNameCamel}ApiGatewayApi`
const integration = `${Config.AppNameCamel}ApiGatewayIntegration`

module.exports = {
    Type: 'AWS::ApiGatewayV2::Route',
    Properties: {
        ApiId: { Ref: api },
        RouteKey: 'POST /',
        AuthorizationType: 'NONE',
        Target: { 'Fn::Join': ['/', ['integrations', { Ref: integration }]] }
    }
}