const fs = require('fs')
const path = require('path')
const code = fs.readFileSync(path.join(__dirname, 'resize', 'index.js')).toString('UTF-8')
const Config = require('../config')
const role = `${Config.AppNameCamel}RolesLambdaResize`

module.exports = {
    Type: 'AWS::Lambda::Function',
    Properties: {
        Code: { ZipFile: code },
        Description: Config.stackName({ pre: 'Response request resizer for ' }),
        FunctionName: Config.stackName({ post: 'LambdaResize' }),
        Handler: 'index.handler',
        Layers: [{ Ref: `${Config.AppNameCamel}LambdaSharpLayer` }],
        MemorySize: 1024,
        Timeout: 30,
        Role: { 'Fn::GetAtt': [role, 'Arn'] },
        Runtime: 'nodejs12.x',
        Tags: Config.tags,
    }
}