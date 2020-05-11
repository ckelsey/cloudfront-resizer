const Config = require('../config')

module.exports = {
    Type: 'AWS::IAM::Role',
    Properties: {
        AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: ['lambda.amazonaws.com', 'edgelambda.amazonaws.com'] },
                    Action: 'sts:AssumeRole'
                }
            ]
        },
        Description: Config.stackName({ pre: 'Lambda role for ', post: '-get' }),
        Policies: [{
            PolicyName: Config.stackName({ post: 'PoliciesLambdaGet' }),
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Effect: 'Allow',
                    Action: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents'
                    ],
                    Resource: '*'
                }, {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket'],
                    Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: `${Config.AppNameCamel}S3Bucket` }]] }]
                }, {
                    Effect: 'Allow',
                    Action: ['s3:GetObject', 's3:GetObjectAcl'],
                    Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: `${Config.AppNameCamel}S3Bucket` }, '/*']] }]
                }]
            }
        }],
        RoleName: Config.stackName({ post: 'LambdaGet' }),
        Tags: Config.tags
    }
}