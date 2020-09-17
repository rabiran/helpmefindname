// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const specialDomains = require('../../config/specialDomains');
const targetConverter = require('../../helpers/personConverter/targetConverter');
const personNormalizer = require('../../helpers/personNormalizer');
const { createInTargetOrch } = require('../apis');
const { handleServiceError, ServiceError } = require('../../helpers/errorHandlers/serviceError');
const { dbUpdateImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');
const sleep = require ('../../helpers/utils/sleep');

/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (person, primaryDomain) => {
    try {
        if(!person.domainUser) {
            throw new ServiceError('has no domainUsers', person.id || person._id);
        }

        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        const id = normalizedPerson.id;

        // if (!isSpecialUser(person)) 
        //     throw new ServiceError('not good user, needs special domainUser', id);

        const personDomains = normalizedPerson.domainUsers.map(domainUser => domainUser.dataSource);

        console.log(personDomains);

        if (!personDomains.includes(specialDomains.dataSource1)) {
            // create dataSource1 user
        }
        else if (!personDomains.includes(specialDomains.dataSource2)) {
            // create dataSource2 user
        }

        // create target domain user

        const targetADuser = targetConverter(normalizedPerson);

        // await sleep(5000);
        await createInTargetOrch(targetADuser);

        console.log(targetADuser);

        const result = await dbUpdateImmigrant(id, {status: { completed: true } });
        if(!result) 
            throw new ServiceError('failed updating status', id);
        
        log('succesfuly sent user for creation.', id);

    }
    catch(err) {
        handleServiceError(err);
    }
}