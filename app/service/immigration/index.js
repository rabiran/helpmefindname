// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const personNormalizer = require("../../helpers/personNormalizer");
const {
  handleServiceError,
  ServiceError,
} = require("../../helpers/errorHandlers/serviceError");
const {
  dbUpdateImmigrant,
  dbAddImmigrant,
} = require("../immigrantsDb/repository");
const { log } = require("../../helpers/logger");
const { triggerKarting } = require("../apis");
const { createInTargetOrch } = require("../apis");
const targetConverter = require("../../helpers/personConverter/targetConverter");
const {
  HttpError,
  handleHttpError,
} = require("../../helpers/errorHandlers/httpError");

const config = require('../../config');

/**
 * @param person person from kartoffel db or api
 * @param primaryUniqueId example: T832423@haha.com
 * @param shadowUsers optional field if there are shadowUsers already
 * @param isNewUser if user is new
 * @param startDate start date for migration
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (
  person,
  primaryUniqueId,
  isNewUser = false,
  gardenerId,
  startDate,
  isUrgent,
) => {
  try {
    const normalizedPerson = personNormalizer(person);
    log("service iteration", normalizedPerson.id);
    // const id = normalizedPerson.id;

    const targetADuser = targetConverter(
      normalizedPerson,
      primaryUniqueId,
      isNewUser,
      startDate,
      isUrgent
    );


    if(!config.isMock) {
      const response = await createInTargetOrch(targetADuser);
    }



    console.log('cant get here');
    
    const data = {
      // _id: normalizedPerson.id,
      personId: normalizedPerson.id,
      status: { progress: "waiting" },
      primaryUniqueId: primaryUniqueId,
      hierarchy: normalizedPerson.hierarchy.join("/"),
      gardenerId,
      fullName: normalizedPerson.fullName,
      identifier: normalizedPerson.identityCard || '-',
      startDate: startDate || new Date(),
      phone: normalizedPerson.phone.join(',') || '',
      mobilePhone: normalizedPerson.mobilePhone.join(',') || ''
    };
    const result = await dbAddImmigrant(data);
    return result;
    // const usersCreated = await userCreator(normalizedPerson, primaryDomainUser, shadowUsers);

    // if(usersCreated) {
    //     await triggerKarting(id);
    //     await dbUpdateImmigrant(id, {'status.progress': 'completed'});
    //     log(`everything is done!`, id);
    // }
  } catch (err) {
    // handleServiceError(err, person.id || person._id);
    // handleHttpError({ message: err.message, code: 500, personId: person.id || person._id});
    // log("service iteration failed", normalizedPerson.id);
    throw new Error(err);
    // throw new HttpError(500, err.message);
  }
};
