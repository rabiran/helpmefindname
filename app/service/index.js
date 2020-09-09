const isSpecialUser = require('../helpers/validators/isSpecialUser');
const personConverter = require('../helpers/personConverter');
const personNormalizer = require('../helpers/personNormalizer');
const { createInTargetOrch } = require('./apis');
const { handleServiceError, ServiceError } = require('../helpers/errorHandlers/serviceError');
const { dbUpdateStatus } = require('./status/statusRepo');
const { log } = require('../helpers/logger');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async (person) => {
    try {
        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        const id = normalizedPerson.id;

        if (!isSpecialUser(person)) 
            throw new ServiceError('not good user, needs special domainUser', id);

        const ADuser = personConverter(normalizedPerson);

        await sleep(5000);
        await createInTargetOrch(ADuser);

        console.log(ADuser);

        const result = await dbUpdateStatus(id, {status: { completed: true } });
        if(!result) 
            throw new ServiceError('failed updating status', id);
        
        log('succesfuly sent user for creation.', id);

    }
    catch(err) {
        handleServiceError(err);
    }
}