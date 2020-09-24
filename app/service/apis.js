const config = require('../config');
const mockPerson = require('../helpers/mocks/person');
const axios = require('axios');
const https = require('https');
const { getSpikeToken } = require('../configure/spike');

const request = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 5000
});

request.interceptors.response.use(
    res => res.data,
    // err => {
    //     // throw new Error(err.response.data.message);
    //     console.log(err);
    //     return Promise.reject(err);
    // }
)

// request.interceptors.request.use(async config => {
//     config.headers.Authorization = await getSpikeToken();
//     return config;
// });

const createInTargetOrch = async (ADuser) => {
    // const headers = { Authorization: token };
    const headers = { auth: { 
        username: config.targetOrchUser, 
        password: config.targetOrchPass 
    }};
    const res = await request.get(`${config.targetOrchUrl}/Orchestrator2012/Orchestrator.svc/Jobs`, { headers,  withCredentials: true  }).catch(err => {
        console.log(err);
        throw new Error('failed sending stuff to orch');
    });
    return res;
    return { success: true };
}

const getPersonApi = async (id) => {
    const token = await getSpikeToken();
    console.log(token);
    const headers = { Authorization: token };
    const person = await request.get(`${config.kartoffelUrl}/api/persons/${id}`, { headers }).catch(err => {
        throw new Error('failed getting person from kartoffel');
    });;
    return person;
    // return mockPerson;
}

module.exports = { createInTargetOrch, getPersonApi }