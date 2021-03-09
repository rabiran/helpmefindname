// const isSpecialUser = require('../helpers/validators/isSpecialUser');
const specialDomains = require("../../config/specialDomains");
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
const userCreator = require("./userCreator");
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
  shadowUsers = []
) => {
  try {
    console.log("service iteration");
    const normalizedPerson = personNormalizer(person);
    // const id = normalizedPerson.id;

    const targetADuser = targetConverter(
      normalizedPerson,
      primaryUniqueId,
      isNewUser,
      startDate,
      isUrgent
    );



    // =================== IMPORTANT UNCOMMENT THIS LATER:

    if(!config.isMock) {
      const response = await createInTargetOrch(targetADuser);
    }
    // ============================



    // throw new Error("done");

    // const progress = "inprogress";
    // const tommy = (subStep) => { return {name: subStep.name, progress}}
    // const steps = response.steps.map(step => { return {name: step.name, subSteps: step.subSteps.map(tommy), progress}  } );

    // console.log("should not get here");

    const data = {
      _id: normalizedPerson.id,
      // personId: normalizedPerson.id,
      status: { progress: "waiting" },
      primaryUniqueId: primaryUniqueId,
      hierarchy: normalizedPerson.hierarchy.join("/"),
      gardenerId,
      fullName: normalizedPerson.fullName,
      identifier: normalizedPerson.identifier || "12345",
      startDate: startDate || new Date(),
      phone: normalizedPerson.phone[0] || '',
      mobilePhone: normalizedPerson.mobilePhone[0] || ''
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
    throw new Error(err);
    // throw new HttpError(500, err.message);
  }
};
