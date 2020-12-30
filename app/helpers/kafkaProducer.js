const { Kafka } = require('kafkajs');
const config = require('../config');

let producer;

const initKafka = async () => {
    const client = new Kafka({
        brokers: config.kafkaBrokers,
        clientId: config.kafkaClientId
    })
    const topic = config.kafkaTopic;
    producer = client.producer();
    await producer.connect();
}

const kafkaProduce = async (data, topic) => {
    const payload = {
        topic,
        messages: [
            data
        ]
    }
    await producer.send(payload);
}

module.exports = { initKafka, kafkaProduce }