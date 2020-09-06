const isSpecialUser = require('../validators/isSpecialUser');
const personConverter = require('../helpers/personConverter');
const personNormalizer = require('../helpers/personNormalizer');
const { createInTargetOrch } = require('./apis');
const handleServiceError = require('../errorHandlers/serviceError');
const { dbUpdateStatus } = require('./status/statusRepo');
const { log } = require('../helpers/logger');

module.exports = async (person) => {
    try {
        let logInfo = true;

        if (!isSpecialUser(person)) 
            throw new Error('not good user, needs special domainUser');

        const normalizedPerson = personNormalizer(person);
        const ADuser = personConverter(normalizedPerson);
        createInTargetOrch(ADuser);

        const id = normalizedPerson.id;
        console.log(ADuser);

        // const result = await dbUpdateStatus(id, {status: { completed: true } });
        // console.log(result);
        log('succesfuly sent user for creation.', id);

    }
    catch(err) {
        handleServiceError(err);
    }
}