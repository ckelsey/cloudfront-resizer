require('./compiler')(
    require('./config').AppNameCamel,
    require('./base'),
    [
        'api-gateway/api.js',
        'api-gateway/integration.js',
        'api-gateway/route.js',

        'cloudfront/access-identity.js',
        'cloudfront/distro.js',

        'cloudwatch/lambda-get.js',
        'cloudwatch/lambda-resize.js',

        'lambda/get-version-1.js',
        'lambda/get.js',
        'lambda/resize.js',
        'lambda/sharp-layer.js',

        'roles/lambda-get.js',
        'roles/lambda-resize.js',
        'roles/api-gateway.js',

        's3/bucket-policy.js',
        's3/bucket.js'
    ],
    __dirname
)