'use strict'

const url = require('url')

const awsClient = require('@scoop/aws-client')

const params = {
    awsRegion: 'us-west-2',
    sqsEndpoint: url.parse(process.env.AWS_SQS_QUEUE_URL).host
}

module.exports = new awsClient.Sqs(params).sqs
