const AppName = 'Cloudfront Resizer'

module.exports = {
    AppName,
    AppNameCamel: AppName.split(' ').join(''),
    StackDescription: 'Gets and resizes an image on S3/CloudFront on the fly. NOTE: it\'s required that this stack be built in us-east-1 for Lambda@Edge functions',
    tags: [{
        Key: 'AppName',
        Value: AppName
    }, {
        Key: 'AppStage',
        Value: { Ref: 'DEPLOYMENT' }
    }],
    tagsMap: {
        AppName: AppName,
        AppStage: { Ref: 'DEPLOYMENT' }
    },
    stackName: (options) => {
        const { pre, post } = Object.assign({}, { pre: '', post: '' }, options)
        return { 'Fn::Join': ['', [pre].concat([{ Ref: 'AWS::StackName' }, '-', { Ref: 'DEPLOYMENT' }], [post])] }
    }
}