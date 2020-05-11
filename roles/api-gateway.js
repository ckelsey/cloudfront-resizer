const Config = require('../config')

module.exports = {
    Type: 'AWS::IAM::Role',
    Properties: {
        AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { Service: 'apigateway.amazonaws.com' },
                    Action: 'sts:AssumeRole'
                }
            ]
        },
        Description: Config.stackName({ pre: 'ApiGateway role for ', post: ' Lambda' }),
        Policies: [{
            PolicyName: Config.stackName({ post: 'PoliciesApiGateway' }),
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: ['lambda:InvokeFunction'],
                        Resource: [
                            { 'Fn::Sub': ['arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:${fn}', { fn: Config.stackName({ post: 'LambdaResize' }) }] }
                        ]
                    }
                ]
            }
        }],
        RoleName: Config.stackName({ post: 'ApiGateway' }),
        Tags: Config.tags
    }
}