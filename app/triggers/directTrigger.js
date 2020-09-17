const sendToService = require('../service/immigration');
const mockDBPerson = require('../helpers/mocks/dbPerson');
const mockPerson = require('../helpers/mocks/person');

module.exports = () => {
    sendToService(mockPerson);
}