const Config = require('../config')
const lambda = `${Config.AppNameCamel}LambdaResize`

module.exports = {
    Type: 'AWS::Logs::LogGroup',
    Properties: {
        LogGroupName: { 'Fn::Join': ['', ['/aws/lambda/', { Ref: lambda }]] },
        RetentionInDays: 14
    }
}