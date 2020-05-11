const Config = require('../config')

module.exports = {
    Type: 'AWS::S3::Bucket',
    Properties: {
        AccessControl: 'Private',
        BucketName: Config.stackName({ post: '-bucket' }),
        Tags: Config.tags,
        CorsConfiguration: {
            CorsRules: [{
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'HEAD'],
                AllowedOrigins: ['*']
            }]
        }
    }
}