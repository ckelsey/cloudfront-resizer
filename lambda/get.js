const fs = require('fs')
const path = require('path')
const Config = require('../config')
const role = `${Config.AppNameCamel}RolesLambdaGet`
const api = { 'Fn::Sub': ['https://${api}.execute-api.${AWS::Region}.amazonaws.com', { api: { Ref: `${Config.AppNameCamel}ApiGatewayApi` } }] }
const code = fs.readFileSync(path.join(__dirname, 'get', 'index.js')).toString('UTF-8').split('{{API}}')

module.exports = {
    Type: 'AWS::Lambda::Function',
    Properties: {
        Code: {
            ZipFile: {
                'Fn::Join': ['',
                    [
                        code[0],
                        api,
                        code[1]
                    ]
                ]
            }
        },
        Description: Config.stackName({ pre: 'Get request gatekeeper for ' }),
        FunctionName: Config.stackName({ post: 'LambdaGet' }),
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': [role, 'Arn'] },
        Runtime: 'nodejs12.x',
        Tags: Config.tags,
    }
}