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
        Description: Config.stackName({ pre: 'Lambda role for ', post: '-resize' }),
        Policies: [{
            PolicyName: Config.stackName({ post: 'PoliciesLambdaResize' }),
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: ['s3:GetObject', 's3:PutObject', 's3:PutObjectAcl'],
                        Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: `${Config.AppNameCamel}S3Bucket` }, '/*']] }]
                    },
                    {
                        Effect: 'Allow',
                        Action: ['s3:ListBucket'],
                        Resource: [{ 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: `${Config.AppNameCamel}S3Bucket` }]] }]
                    }, {
                        Effect: 'Allow',
                        Action: [
                            'logs:CreateLogGroup',
                            'logs:CreateLogStream',
                            'logs:PutLogEvents'
                        ],
                        Resource: '*'
                    }
                ]
            }
        }],
        RoleName: Config.stackName({ post: 'LambdaResize' }),
        Tags: Config.tags
    }
}