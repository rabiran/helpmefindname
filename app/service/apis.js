const config = require('../config');
const mockPerson = require('../helpers/mocks/person');
const axios = require('axios');
const https = require('https');
const { getSpikeToken } = require('../configure/spike');
const xmlGenerator = require('../helpers/orchFormater');
const { retry } = require('../helpers/utils/retry');

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

    const xml = xmlGenerator(ADuser);
    console.log(xml);
    // const headers = { Authorization: token };
    const headers = { auth: { 
        username: config.targetOrchUser, 
        password: config.targetOrchPass 
    }};
    const url = `${config.targetOrchUrl}/Orchestrator2012/Orchestrator.svc/Jobs`;

    const requestFn = async () => await request.get(url, { headers,  withCredentials: true  });

    const res = await retry(requestFn).catch(err => {
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
    const url = `${config.kartoffelUrl}/api/persons/${id}`;
    const person = await request.get(url, { headers }).catch(err => {
        throw new Error('failed getting person from kartoffel');
    });;
    return person;
    // return mockPerson;
}

module.exports = { createInTargetOrch, getPersonApi }