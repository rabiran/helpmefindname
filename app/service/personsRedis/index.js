

const redis = require("redis");
const config = require('../../config');
const { getPersonsApi } = require('../apis');
const { promisify } = require("util");

let client;
let getAsync 
let hgetAsync;

const configureRedisPeople = async () => {
    client = redis.createClient(config.redisUrl);
    getAsync = promisify(client.get).bind(client);
    hgetAsync = promisify(client.hgetall).bind(client);

    client.on("connect", () => {
        console.log("Redis connected");
    })

    client.on("error", (err) => {
        console.error("Redis Error: " + err);
    })

    setRedisPersons();
}

const setRedisPersons = async () => {
    const persons = await getPersonsApi();
    client.set('persons', persons.length);
    console.log('saved count in redis');
}

const getRedisPersons = async () => {
    const count = await getAsync('persons');
    return count;
}


// const redisGetPersons = async () => {
//     return await getToken();
// }

module.exports = { configureRedisPeople, setRedisPersons, getRedisPersons }