// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const specialDomains = require('../../config/specialDomains');
const personNormalizer = require('../../helpers/personNormalizer');
const { handleServiceError, ServiceError } = require('../../helpers/errorHandlers/serviceError');
const { dbUpdateImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');
const userCreator = require('./userCreator');
const { triggerKarting } = require('../apis');

/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * @param shadowUsers optional field if there are shadowUsers already
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (person, primaryDomain, shadowUsers = []) => {
    try {
        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        const id = normalizedPerson.id;

        const usersCreated = await userCreator(normalizedPerson, primaryDomain, shadowUsers);

        if(usersCreated) {
            await triggerKarting(id);
            await dbUpdateImmigrant(id, {'status.progress': 'completed'});
            log(`everything is done!`, id);
        }

    }
    catch(err) {
        handleServiceError(err, person.id || person._id);
    }
}