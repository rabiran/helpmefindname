const config = require('../config');
const mockPerson = require('../helpers/mocks/person');
const axios = require('axios');
const https = require('https');
const { getSpikeToken } = require('../configure/spike');

const request = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

request.interceptors.response.use(
    res => res.data,
    err => {
        throw new Error(err.response.data.message);
    }
)

// request.interceptors.request.use(async config => {
//     config.headers.Authorization = await getSpikeToken();
//     return config;
// });

const createInTargetOrch = async (ADuser) => {
    return { success: true };
}

const getPersonApi = async (id) => {
    const token = await getSpikeToken();
    console.log(token);
    const headers = { Authorization: token };
    const person = await request.get(`${config.kartoffelUrl}/api/persons/${id}`, { headers });
    return person;
    // return mockPerson;
}

module.exports = { createInTargetOrch, getPersonApi }