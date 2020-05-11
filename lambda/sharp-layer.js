module.exports = {
    Type: 'AWS::Lambda::LayerVersion',
    Properties: {
        CompatibleRuntimes: ['nodejs12.x'],
        Content: {
            S3Bucket: { Ref: 'SHARPBUCKET' },
            S3Key: { Ref: 'SHARPKEY' }
        },
        Description: 'Sharp layer via: https://github.com/Umkus/lambda-layer-sharp',
    }
}