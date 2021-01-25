// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const specialDomains = require('../../config/specialDomains');
const personNormalizer = require('../../helpers/personNormalizer');
const { handleServiceError, ServiceError } = require('../../helpers/errorHandlers/serviceError');
const { dbUpdateImmigrant, dbAddImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');
const userCreator = require('./userCreator');
const { triggerKarting } = require('../apis');


const { createInTargetOrch } = require('../apis');
const targetConverter = require('../../helpers/personConverter/targetConverter');
const { HttpError } = require('helpers/errorHandlers/httpError');

/**
 * @param person person from kartoffel db or api
 * @param primaryDomainUser example: T832423@haha.com
 * @param shadowUsers optional field if there are shadowUsers already
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (person, primaryDomainUser, isNewUser = false, gardenerId, shadowUsers = []) => {
    try {
        console.log('service iteration');
        const normalizedPerson = personNormalizer(person);
        // const id = normalizedPerson.id;

        const targetADuser = targetConverter(normalizedPerson, primaryDomainUser, isNewUser);
        const response = await createInTargetOrch(targetADuser);

        const progress = "inprogress";
        const tommy = (subStep) => { return {name: subStep.name, progress}}
        const steps = steps.map(step => { return {name: step.name, subSteps: step.subSteps.map(tommy), progress}  } );

        const data = {
            _id: response.id,
            personId: person.id,
            status: { progress: 'inprogress', steps: steps },
            primaryDomainUser: primaryDomainUser.dataSource,
            hierarchy: person.hierarchy.join('/'),
            gardenerId,
            fullName: person.fullName,
            identifier: person.identifier || '12345'
        };
        const result = await dbAddImmigrant(data);
        return result;
        // const usersCreated = await userCreator(normalizedPerson, primaryDomainUser, shadowUsers);

        // if(usersCreated) {
        //     await triggerKarting(id);
        //     await dbUpdateImmigrant(id, {'status.progress': 'completed'});
        //     log(`everything is done!`, id);
        // }

    }
    catch (err) {
        // handleServiceError(err, person.id || person._id);
        throw new HttpError(500, err.message);
    }
}