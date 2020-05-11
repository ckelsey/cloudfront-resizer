const Config = require('../config')
const api = { Ref: `${Config.AppNameCamel}ApiGatewayApi` }
const fn = { 'Fn::GetAtt': [`${Config.AppNameCamel}LambdaResize`, 'Arn'] }
const role = { 'Fn::GetAtt': [`${Config.AppNameCamel}RolesApiGateway`, 'Arn'] }

module.exports = {
    Type: 'AWS::ApiGatewayV2::Integration',
    Properties: {
        ApiId: api,
        ConnectionType: 'INTERNET',
        CredentialsArn: role,
        Description: Config.stackName({ post: ' lambda integration for the API' }),
        IntegrationMethod: 'POST',
        IntegrationType: 'AWS_PROXY',
        IntegrationUri: {
            'Fn::Sub': [
                'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${fnArn}/invocations',
                { fnArn: fn }
            ]
        },
        PayloadFormatVersion: '2.0'
    }
}