const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../configure/index');
const schema = require('../immigrantsDb/schema');
const sleep = require('../../helpers/utils/sleep');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

let expressApp;

const newImmigrantBad = { id: 'sad324kmzsd', badField: 'asdad' };
const newImmigrantBad2 = { id: '5f730ea2eaa6861b4a213cc8', primaryUniqueId: 'sadasdsad' };
const newImmigrant = { id: '5f730ea2eaa6861b4a213cc8', primaryUniqueId: 'estella0@rabiran.com', gardenerId: "2" };

const globalUpdateImmigrantBad = [
    {
        "id": "5f730ea2eaa6861b4a213cc8",
        "steps": [
            {
                "name": "making pizza",
                "subSteps": [
                    {
                        "name": "preparing",
                        "status": "baddddd"
                    },
                    {
                        "name": "baking",
                        "status": 1
                    }
                ]
            },
            {
                "name": "delivering pizza",
                "subSteps": [
                    {
                        "name": "finding adress",
                        "status": 0
                    },
                    {
                        "name": "delivering",
                        "status": 0
                    },
                    {
                        "name": "accepting payment",
                        "status": 1
                    }
                ]
            }
        ]
    }
]

const globalUpdateImmigrant = [
    {
        "id": "5f730ea2eaa6861b4a213cc8",
        "steps": [
            {
                "name": "making pizza",
                "subSteps": [
                    {
                        "name": "preparing",
                        "status": 0
                    },
                    {
                        "name": "baking",
                        "status": 1
                    }
                ]
            },
            {
                "name": "delivering pizza",
                "subSteps": [
                    {
                        "name": "finding adress",
                        "status": 0
                    },
                    {
                        "name": "delivering",
                        "status": 0
                    },
                    {
                        "name": "accepting payment",
                        "status": 1
                    }
                ]
            }
        ]
    }
]



const updateImmigrantStepBad = { step: 'making pizza', subStep: 'packaging the cheese', progress: 'completed' };
const updateImmigrantStepBad2 = { step: 'making pizza', subStep: 'preparing', progress: 'bad' };
const updateImmigrantStep = { step: 'making pizza', subStep: 'preparing', progress: 'completed' };

const updateImmigrantBad = { randomshit: 'idk '};

const updateImmigrantPauseWrong = { paused: true };
const updateImmigrantUnpauseable = { unpauseable: true };
const updateImmigrantPause = { paused: true };
const updateImmigrantViewed = { viewed: true };
// const updateImmigrantUnpause = { pause: false };


before(async () => {
    console.log = function () { };
    expressApp = await server();
    console.log("Waiting 3 seconds..");
    await sleep(3000);
});

beforeEach((done) => {
    schema.deleteMany({}, (err) => {
        done();
    });
});


describe('GET /immigrant', () => {
    it('Should get all the immigrants', async () => {
        const res = await chai.request(expressApp).get('/api/immigrant');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
    });
});

describe('POST /immigrant', () => {
    it('should give 400 for incorrect fields', async () => {
        const res = await chai.request(expressApp).post('/api/immigrant').send(newImmigrantBad);
        res.should.have.status(400);
    });
    it('should give 400 for user with not his primaryUniqueId', async () => {
        const res = await chai.request(expressApp).post('/api/immigrant').send(newImmigrantBad2);
        res.should.have.status(400);
    });
    it('should create', async () => {
        const res = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
    });
});

describe('PUT /immigrant', () => {
    it('Should give empty array because no correct id was given', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = 'asdlasdl';
        console.log(globalUpdateImmigrantBad);
        const res = await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        console.log(res.body);
        res.should.have.status(200);
        res.body.length.should.be.eql(0);
    });
    it('Should give 400 for incorrect field', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrantBad[0].id = migration.body.id;
        const res = await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrantBad);
        res.should.have.status(400);
    });
    it('Should create the steps of migration', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        const res = await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
    });
});

describe('PUT /immigrant/:id', () => {
    it('Should give 400 with not existing substep', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantStepBad);
        res.should.have.status(400);
    });
    it('Should give 400 with incorrect progress', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantStepBad2);
        res.should.have.status(400);
    });
    it('Should give 400 with overall wrong fields', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantBad);
        res.should.have.status(400);
    });

    it('Should update step and substep of migration', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantStep);
        console.log(res.body);
        res.should.have.status(200);
    });



    it('Should give 400 when trying to pause unpauseable migration', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantUnpauseable);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantPauseWrong);
        console.log(res.body);
        res.should.have.status(400);
    });

    it('Should make migration unpauseable', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantUnpauseable);
        res.should.have.status(200);
        res.body.unpauseable.should.be.eql(true);
    });
    it('Should pause migration', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantPause);
        console.log(res);
        res.should.have.status(200);
        res.body.status.progress.should.be.eql('paused');
    });
    it('Should mark mi;gration as viewed', async () => {
        const migration = await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        globalUpdateImmigrant[0].id = migration.body.id;
        await chai.request(expressApp).put('/api/immigrant').send(globalUpdateImmigrant);
        const res = await chai.request(expressApp).put(`/api/immigrant/${migration.body.id}`).send(updateImmigrantViewed);
        res.should.have.status(200);
        // res.body.status.progress.shoud.equal('paused');
        res.body.viewed.should.be.eql(true);
    });
});