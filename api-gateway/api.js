const Config = require('../config')
const role = { 'Fn::GetAtt': [`${Config.AppNameCamel}RolesApiGateway`, 'Arn'] }
const fn = { 'Fn::GetAtt': [`${Config.AppNameCamel}LambdaResize`, 'Arn'] }

module.exports = {
    Type: 'AWS::ApiGatewayV2::Api',
    Properties: {
        CorsConfiguration: {
            AllowCredentials: false,
            AllowMethods: ['POST'],
            AllowHeaders: []
        },
        CredentialsArn: role,
        Description: Config.stackName({ post: ' API' }),
        Name: Config.stackName({ post: ' API' }),
        ProtocolType: 'HTTP',
        Tags: Config.tagsMap,
        Target: fn
    }
}