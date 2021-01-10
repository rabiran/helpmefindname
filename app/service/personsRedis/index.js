

const redis = require("redis");
const config = require('../../config');
const { getPersonsApi } = require('../apis');
const { promisify } = require("util");
const schedule = require('node-schedule');

let client;
let getAsync 
// let hgetAsync;
const cronTime = '0 15 0 * * *'; // 12:15 everyday

// prepares daily report of persons count in kartoffel
const configureRedisPeople = async () => {
    client = redis.createClient(config.redisUrl);
    getAsync = promisify(client.get).bind(client);
    // hgetAsync = promisify(client.hgetall).bind(client);

    client.on("connect", () => {
        console.log("Redis connected");
    })

    client.on("error", (err) => {
        console.error("Redis Error: " + err);
    })

    setRedisPersons();
    schedule.scheduleJob(cronTime, () => {
        setRedisPersons();
    });
}

// sets count of all persons in kartoffel to redis
const setRedisPersons = async () => {
    const persons = await getPersonsApi();
    client.set('persons', persons.length);
    console.log('saved count in redis');
}

// gets the count
const getRedisPersons = async () => {
    const count = await getAsync('persons');
    return count;
}

module.exports = { configureRedisPeople, setRedisPersons, getRedisPersons }