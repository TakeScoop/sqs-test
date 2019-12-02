'use strict'

const util = require('util')
const Promise = require('bluebird')

process.env.AWS_ACCESS_KEY_ID = '1'
process.env.AWS_SECRET_ACCESS_KEY = 'supersecret'
process.env.AWS_SQS_QUEUE_URL = 'http://localhost:9324/queue/default'
const sqs = require('../src/sqs')
const sinon = require('sinon')
const { Consumer } = require('sqs-consumer')

const setTimeoutPromise = util.promisify(setTimeout)

describe('sqs', function() {
    afterEach(async function() {
        sinon.restore()
    })
    
    const queueUrl = process.env.AWS_SQS_QUEUE_URL
    
    it('should start and stop the consumer', async function() {
        const consumer = Consumer.create({
            sqs: sqs,
            queueUrl: queueUrl,
            handleMessage: function() {},
            waitTimeSeconds: 1,
            pollingWaitTimeMs: 50,
            handleMessageTimeout: 1000
        })
        await consumer.start()
        await consumer.stop()
    })
    
    it('should get message_received event', async function() {
        this.timeout(10000)
        const consumer = Consumer.create({
            sqs: sqs,
            queueUrl: queueUrl,
            handleMessage: function() {},
            waitTimeSeconds: 1,
            pollingWaitTimeMs: 50,
            handleMessageTimeout: 1000
        })
        
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
        
        const tester = { test: () => {} }
        const messageReceivedSpy = sinon.spy(tester, 'test')
        consumer.on('message_received', tester.test)
        await consumer.start()
        
        await setTimeoutPromise(1200)
        expect(messageReceivedSpy.called).to.be.true()
        
        await consumer.stop()
    })
})