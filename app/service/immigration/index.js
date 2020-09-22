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
        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        
        // if (!isSfpecialUser(person)) 
        //     throw new ServiceError('not good user, needs special domainUser', id);

        const usersCreated = await userCreator(normalizedPerson);

        // const result = await dbUpdateImmigrant(id, {status: { completed: true } });
        // await dbUpdateImmigrant(id, { status: { step: `creating ${domain} user` } });
        // if(!result) 
        //     throw new ServiceError('failed updating status', id);
        
        // log(`succesfuly sent user for ${domain} user creation.`, id);

        if(usersCreated) {
            // karting api blah blah blah
            await dbUpdateImmigrant(id, { status: { progress: 'completed' } });
            log(`everything is done!`, id);
        }

    }
    catch(err) {
        handleServiceError(err, person.id || person._id);
    }
}