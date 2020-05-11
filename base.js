const Config = require('./config')
const CloudFront = `${Config.AppNameCamel}CloudfrontDistro`
const S3 = `${Config.AppNameCamel}S3Bucket`
const api = { 'Fn::Sub': ['https://${api}.execute-api.${AWS::Region}.amazonaws.com', { api: { Ref: `${Config.AppNameCamel}ApiGatewayApi` } }] }

module.exports = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: Config.StackDescription,
    Parameters: {
        'DEPLOYMENT': {
            Type: 'String',
            Description: 'Key used to mark what deployment this stack is for, i.e. production/stage/development',
            Default: 'production'
        },
        'SHARPBUCKET': {
            Type: 'String',
            Description: 'The bucket where the sharp.zip can be found for the sharp layer',
            Default: 'ck-stuff-east'
        },
        'SHARPKEY': {
            Type: 'String',
            Description: 'The key where the sharp.zip can be found for the sharp layer',
            Default: 'sharp-layer.zip'
        }
    },
    Outputs: {
        cloudfront: {
            Description: 'CloudFront url',
            Value: { 'Fn::GetAtt': [CloudFront, 'DomainName'] }
        },
        s3: {
            Description: 'S3 Bucket',
            Value: { Ref: S3 }
        },
        api: {
            Description: 'Api url',
            Value: api
        }
    }
}