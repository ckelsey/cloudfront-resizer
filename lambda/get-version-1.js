const Config = require('../config')
const fn = `${Config.AppNameCamel}LambdaGet`

module.exports = {
    Type: 'AWS::Lambda::Version',
    Properties: {
        FunctionName: { Ref: fn },
        Description: Config.stackName({ post: ' version 1 for CloudFront distribution viewer-request trigger' })
    }
}