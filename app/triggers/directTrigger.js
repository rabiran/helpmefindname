const sendToService = require('../service');
const mockDBPerson = require('../mocks/dbPerson');
const mockPerson = require('../mocks/person');

module.exports = () => {
    sendToService(mockDBPerson);
}