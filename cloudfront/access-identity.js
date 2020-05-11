const Config = require('../config')
module.exports = {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
        CloudFrontOriginAccessIdentityConfig: {
            Comment: Config.stackName({ post: ' CloudFrontOriginAccessIdentity' })
        }
    }
}