'use strict'

const Promise = require('bluebird')

process.env.AWS_ACCESS_KEY_ID = '1'
process.env.AWS_SECRET_ACCESS_KEY = 'supersecret'
process.env.AWS_SQS_QUEUE_URL = 'http://localhost:9324/queue/default'
const sqs = require('../src/sqs')

describe('sqs', function() {
    
    beforeEach(async() => {
        await sqs.purgeQueue({
            QueueUrl: queueUrl
        }).promise()
    })
    
    const queueUrl = process.env.AWS_SQS_QUEUE_URL
    it('should receive a message', async function() {
        this.timeout(10000)
        await sqs.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: 'Hello queue',
            MessageAttributes: {
                jobType: {
                    StringValue: 'tester',
                    DataType: 'String'
                }
            },
        }).promise()
        
        const { Messages: messages } = await sqs.receiveMessage({
            QueueUrl: queueUrl,
            WaitTimeSeconds: 5
        }).promise()
        
        expect(messages).to.be.an.array().and.have.length(1)
        const message = messages[0]
        expect(message).to.include({
            Body: 'Hello queue'
        })
    })
})