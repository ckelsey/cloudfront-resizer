const Config = require('../config')
const Bucket = { Ref: `${Config.AppNameCamel}S3Bucket` }
const GetRole = { 'Fn::GetAtt': [`${Config.AppNameCamel}RolesLambdaGet`, 'Arn'] }
const ResizeRole = { 'Fn::GetAtt': [`${Config.AppNameCamel}RolesLambdaResize`, 'Arn'] }
const accessIdentity = {
    'Fn::Join': [' ',
        [
            'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity',
            { Ref: `${Config.AppNameCamel}CloudfrontAccessIdentity` }
        ]
    ]
}

module.exports = {
    Type: 'AWS::S3::BucketPolicy',
    Properties: {
        Bucket,
        PolicyDocument: {
            Statement: [{
                Action: ['s3:GetObject', 's3:GetObjectAcl', 's3:PutObject', 's3:PutObjectAcl'],
                Effect: 'Allow',
                Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', Bucket, '/*']] }],
                Principal: { AWS: [accessIdentity, ResizeRole, GetRole] }
            }, {
                Action: ['s3:ListBucket'],
                Effect: 'Allow',
                Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', Bucket]] }],
                Principal: { AWS: [accessIdentity, ResizeRole, GetRole] }
            }]
        }
    }
}