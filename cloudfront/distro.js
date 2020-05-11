const Config = require('../config')
const OriginAccessIdentity = `${Config.AppNameCamel}CloudfrontAccessIdentity`

module.exports = {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
        Tags: Config.tags,
        DistributionConfig: {
            CacheBehaviors: [],
            DefaultCacheBehavior: {
                AllowedMethods: ['HEAD', 'GET'],
                CachedMethods: ['GET', 'HEAD'],
                Compress: false,
                ForwardedValues: { Cookies: { Forward: 'none' }, QueryString: true },
                SmoothStreaming: false,
                TargetOriginId: { Ref: `${Config.AppNameCamel}S3Bucket` },
                TrustedSigners: [],
                ViewerProtocolPolicy: 'redirect-to-https',
                LambdaFunctionAssociations: [{
                    EventType: 'origin-request',
                    LambdaFunctionARN: { Ref: `${Config.AppNameCamel}LambdaGetVersion1` }
                }]
            },
            Comment: Config.stackName(),
            Enabled: true,
            Origins: [{
                DomainName: {
                    'Fn::Join': [
                        '', [
                            { Ref: `${Config.AppNameCamel}S3Bucket` },
                            '.s3.amazonaws.com'
                        ]
                    ]
                },
                Id: { Ref: `${Config.AppNameCamel}S3Bucket` },
                S3OriginConfig: {
                    OriginAccessIdentity: {
                        'Fn::Join': ['', ['origin-access-identity/cloudfront/', { Ref: OriginAccessIdentity }]]
                    }
                }
            }],
            ViewerCertificate: {
                CloudFrontDefaultCertificate: true,
                MinimumProtocolVersion: 'TLSv1.2_2018'
            }
        }
    }
}