const config = require('../config');
const util = require('util');
const mockPerson = require('../helpers/mocks/person');
const axios = require('axios');
const https = require('https');
const { getSpikeToken } = require('../configure/spike');
const xmlGenerator = require('../helpers/orchFormater');
const { retry } = require('../helpers/utils/retry');
const ntlm = require('httpntlm');

const antlm = util.promisify(ntlm.post);

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

// ntlm.post(options, async (err, res) => {
//     if(err) throw new Error('failed sending stuff to orch');

//     console.log(res.body);
//     // const haha = await client.get(url).catch(err => {
//     //     console.log(err.response.data);
//     // });
//     // console.log(haha);
// })

const createInTargetOrch = async (data) => {
    const runBookId = config.orchCreateRunbookId;
    const xml = xmlGenerator(data, runBookId);
    // // const headers = { Authorization: token };
    // const headers = { auth: { 
    //     username: config.targetOrchUser, 
    //     password: config.targetOrchPass 
    // }};
    // const url = `${config.targetOrchUrl}/Orchestrator2012/Orchestrator.svc/Jobs`;


    const url = config.orchUrl;
    const domain = config.orchDomain;
    const user = config.orchUser
    const pass = config.orchPass

    const options = {
        url: url,
        username: user,
        password: pass,
        workstation: '',
        domain: domain,
        body: xml,
        headers: {'Content-Type': 'application/atom+xml'}
    };

    const response = await antlm(options).catch(err => {
        console.log(err);
        throw new Error('failed sending stuff to orch');
    })

    console.log(xml);
    console.log(response.body);
    if(response.statusCode === 401) throw new Error('Unauthorized for orch');
    if(response.statusCode === 400) throw new Error('Validation failed for orch');


    return response.body;
    
    return {
        "id": "1",
        "steps": [
            {
                "name": "making pizza",
                "subSteps": [
                    {
                        "name": "preparing"
                    },
                    {
                        "name": "baking"
                    }
                ]
            },
            {
                "name": "delivering pizza",
                "subSteps": [
                    {
                        "name": "finding adress"
                    },
                    {
                        "name": "delivering"
                    },
                    {
                        "name": "accepting payment"
                    }
                ]
            }
         ]     
    }

    
    // const orchRequest = async () => await request.get(url, { headers,  withCredentials: true  });

    // const res = await retry(orchRequest).catch(err => {
    //     console.log(err);
    //     throw new Error('failed sending stuff to orch');
    // });

    // return res;
    // return { success: true };
}

const orchPause = async (data) => {
    const { id, pause } = data;
    const runBookId = '123';
    const xml = xmlGenerator(data, runBookId);
    console.log(xml);
    // const headers = { Authorization: token };
    const headers = { auth: { 
        username: config.targetOrchUser, 
        password: config.targetOrchPass 
    }};
    const url = `${config.targetOrchUrl}/Orchestrator2012/Orchestrator.svc/Jobs`;

    const orchRequest = async () => await request.get(url, { headers,  withCredentials: true  });

    const res = await retry(orchRequest).catch(err => {
        console.log(err);
        throw new Error('failed sending stuff to orch');
    });

    return res;
}

const orchRetry = async (data) => {
    const { id, step, subStep } = data;
    const runBookId = '123';
    const xml = xmlGenerator(data, runBookId);
    console.log(xml);
    // const headers = { Authorization: token };
    const headers = { auth: { 
        username: config.targetOrchUser, 
        password: config.targetOrchPass 
    }};
    const url = `${config.targetOrchUrl}/Orchestrator2012/Orchestrator.svc/Jobs`;

    const orchRequest = async () => await request.get(url, { headers,  withCredentials: true  });

    const res = await retry(orchRequest).catch(err => {
        console.log(err);
        throw new Error('failed sending stuff to orch');
    });

    return res;
}

const getPersonApi = async (id) => {
    const token = await getSpikeToken();
    console.log(token);
    const headers = { Authorization: token };
    const url = `${config.kartoffelUrl}/api/persons/${id}`;
    const person = await request.get(url, { headers }).catch(err => {
        throw new Error('failed getting person from kartoffel');
    });
    return person;
    // return mockPerson;
}

const getPersonsApi = async (id) => {
    const token = await getSpikeToken();
    console.log(token);
    const headers = { Authorization: token };
    const url = `${config.kartoffelUrl}/api/persons`;
    const persons = await request.get(url, { headers }).catch(err => {
        throw new Error('failed getting person from kartoffel');
    });
    return persons;
    // return mockPerson;
}
const triggerKarting = async (id) => {
    return true;
}

module.exports = { createInTargetOrch, orchPause, orchRetry, getPersonApi, triggerKarting, getPersonsApi }