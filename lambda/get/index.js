const querystring = require('querystring')
const path = require('path')
const api = '{{API}}'
const AWS = require('aws-sdk')

const getUrl = (source, { width = 0, height = 0, format }) => {
    if (!width && !height) { return { source, parsed: source } }

    const parsedUrl = path.parse(source)
    const _format = format && ['jpg', 'jpeg', 'png'].indexOf(format) > -1 ? format : parsedUrl.ext.substring(1)
    const parsed = [parsedUrl.dir == '/' ? '' : parsedUrl.dir, `${width}x${height}`, `${parsedUrl.name}.${_format}`].join('/')

    return { parsed, source }
}

const check = (S3, Key, Bucket) => new Promise(resolve => {
    S3.headObject({ Bucket, Key }, err => { resolve(err ? false : true) })
})

const correctKey = key => !key ? '' : key[0] === '/' ? key.substring(1) : key

const exists = (requestedKey, Key, Bucket) => {
    const S3 = new AWS.S3()

    return Promise.all([
        check(S3, correctKey(requestedKey), Bucket),
        check(S3, correctKey(Key), Bucket)
    ]).then(res => ({
        needsResize: !res[0],
        hasSource: res[1]
    }))
}

exports.handler = async (event, _, cb) => {
    const request = event.Records[0].cf.request
    const method = request.method
    const query = querystring.parse(request.querystring) || {}
    const domain = `https://${event.Records[0].cf.config.distributionDomainName}`

    if (method == 'OPTIONS') {
        cb(null, request)
    } else if (method == 'GET') {
        const urls = getUrl(request.uri, query)
        const Bucket = request.origin.s3.domainName.split('.s3.')[0]
        const doesExist = await exists(urls.parsed, urls.source, Bucket)

        if (doesExist.hasSource && doesExist.needsResize) {
            const location = `${api}?bucket=${Bucket}&width=${query.width || 0}&height=${query.height || 0}&src=${encodeURIComponent(urls.source)}&format=${path.parse(urls.parsed).ext.substring(1)}&redirect=${encodeURIComponent(`${domain}${request.uri}?${request.querystring}`)}`
            const redirectResponse = {
                status: '301',
                statusDescription: 'Moved Permanently',
                headers: {
                    'location': [{
                        value: location,
                    }],
                    'cache-control': [{
                        value: 'max-age=3600'
                    }]
                },
            }

            cb(null, redirectResponse)
        } else if (!doesExist.needsResize) {
            request.uri = urls.parsed
            cb(null, request)
        } else {
            cb(null, request)
        }
    } else {
        cb(null, { status: 404, statusDescription: 'Not Found' })
    }
}