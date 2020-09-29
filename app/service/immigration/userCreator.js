
const { createInTargetOrch } = require('../apis');
const targetConverter = require('../../helpers/personConverter/targetConverter');
const specialDomains = require('../../config/specialDomains');
const { dbUpdateImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');

/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * starts the correct user creation process and returns true if all created.
 */
module.exports = async (normalizedPerson) => {

        const personDomains = normalizedPerson.domainUsers.map(domainUser => domainUser.dataSource);
        console.log(personDomains);
        const id = normalizedPerson.id;

        // if (!personDomains.includes(specialDomains.ads)) {
        //     // create dataSource1 user
        //     return specialDomains.ads;
        // }
        // else if (!personDomains.includes(specialDomains.es)) {
        //     // create dataSource2 user
        //     return specialDomains.es;
        // }

        const targetADuser = targetConverter(normalizedPerson);
        await createInTargetOrch(targetADuser);

        console.log(targetADuser);

        await logAndUpdateDb(id, specialDomains.target);
        return false;
}

const logAndUpdateDb = async (id, domain) => {
    await dbUpdateImmigrant(id, { status: { step: `creating ${domain} user` } });
    log(`succesfuly sent user for ${domain} user creation.`, id);
}