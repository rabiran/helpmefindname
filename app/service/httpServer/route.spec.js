const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../configure/index');
const schema = require('../immigrantsDb/schema');
const sleep = require('../../helpers/utils/sleep');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

let expressApp;

const newImmigrantBad = {id: 'sad324kmzsd', badField: 'asdad'};
const newImmigrantBad2 = {id: '5f730e9ceaa6861b4a213cb1', primaryDomainUser: 'unknownDomain'};
const newImmigrant= {id: '5f730e9ceaa6861b4a213cb1', primaryDomainUser: 'ads_name'};

const updateImmigrant = { id: '5f730e9ceaa6861b4a213cb1', type: 'message', message: 'packaging the cheese'};
const updateImmigrantComplete = { id: '5f730e9ceaa6861b4a213cb1', type: 'complete', shadowUser: {
    domainUser: 'es_name',
    fields: {
        hahahah: 'ajjadajd'
    }
}};

before(async()=> {
    console.log = function () {};
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
    it('should give 400 for user with not his primaryDomain', async () => {
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
    it('Should update substep message', async () => {
        await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        await sleep(1000); // fake wait for service to run
        const res = await chai.request(expressApp).put('/api/immigrant').send(updateImmigrant);
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.deep.property('status.substep');
    });
    it('Should update step as user created', async () => {
        await chai.request(expressApp).post('/api/immigrant').send(newImmigrant);
        await sleep(1000); // fake wait for service to run
        const res = await chai.request(expressApp).put('/api/immigrant').send(updateImmigrantComplete);
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.deep.property('status.step', 'user created');
    });
});