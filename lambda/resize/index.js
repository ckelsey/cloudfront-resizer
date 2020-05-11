const path = require('path')
const AWS = require('aws-sdk')
const sharp = require('sharp')

const correctKey = key => !key ? '' : key[0] === '/' ? key.substring(1) : key

const resize = (Key, Bucket, S3, width, height, format, output) => new Promise(resolve => {
    S3.getObject({ Bucket, Key }, (err, data) => {
        if (err) { return resolve(false) }

        const options = {}

        if (width) { options.width = width }
        if (height) { options.height = height }

        sharp(data.Body)
            .resize(options)
            .toFormat(format || 'jpg')
            .toBuffer((err, Body) => {
                S3.putObject({
                    Body,
                    Bucket,
                    Key: output
                }, (err, data) => {
                    resolve(data)
                })
            })
    })
})

const tryExisting = (Key, Bucket, S3) => new Promise(resolve => {
    S3.getObject({ Bucket, Key }, (err, data) => {
        resolve(err ? false : data.Body)
    })
})

exports.handler = async (event, ctx, callback) => {
    const query = event.queryStringParameters || {}
    const bucket = query.bucket
    const src = query.src
    const redirect = decodeURIComponent(query.redirect)
    const domain = redirect.split(src)[0]
    const width = parseInt(query.width || 0)
    const height = parseInt(query.height || 0)
    const parsed = path.parse(correctKey(src))
    const format = query.format || parsed.ext.substring(1)
    const output = correctKey([parsed.dir == '/' ? '' : parsed.dir, `${width}x${height}`, `${parsed.name}.${format}`].join('/'))

    const do404 = () => {
        callback(JSON.stringify({
            errorType: 'NotFound',
            httpStatus: 404,
            requestId: ctx.awsRequestId,
            trace: {}
        }))
    }

    const validResponse = () => {
        callback(null, {
            statusCode: 301,
            headers: { 'Location': `${domain}/${output}` }
        })
    }

    if (!bucket || !src) {
        do404()
    } else {

        const S3 = new AWS.S3()
        const existing = await tryExisting(output, bucket, S3)

        if (existing) {
            validResponse()
        } else {
            const resized = await resize(correctKey(src), bucket, S3, width, height, format, output)

            if (!resized) {
                do404()
            } else {
                validResponse()
            }
        }
    }
}