const sendToService = require('../service');
const mockDBPerson = require('../helpers/mocks/dbPerson');
const mockPerson = require('../helpers/mocks/person');

module.exports = () => {
    sendToService(mockDBPerson);
}