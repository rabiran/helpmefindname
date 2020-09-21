// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const specialDomains = require('../../config/specialDomains');
const personNormalizer = require('../../helpers/personNormalizer');
const { handleServiceError, ServiceError } = require('../../helpers/errorHandlers/serviceError');
const { dbUpdateImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');
const userCreator = require('./userCreator');
/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (person, primaryDomain) => {
    try {
        if(!person.domainUsers) {
            throw new ServiceError('has no domainUsers', person.id || person._id);
        }

        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        const id = normalizedPerson.id;

        // if (!isSfpecialUser(person)) 
        //     throw new ServiceError('not good user, needs special domainUser', id);


        const domain = await userCreator(normalizedPerson);

        // const result = await dbUpdateImmigrant(id, {status: { completed: true } });
        const result = await dbUpdateImmigrant(id, { status: { step: `creating ${domain} user` } });
        if(!result) 
            throw new ServiceError('failed updating status', id);
        
        log(`succesfuly sent user for ${domain} user creation.`, id);

    }
    catch(err) {
        handleServiceError(err);
    }
}