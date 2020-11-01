
const { createInTargetOrch } = require('../apis');
const targetConverter = require('../../helpers/personConverter/targetConverter');
const esConverter = require('../../helpers/personConverter/esConverter');
const adsConverter = require('../../helpers/personConverter/adsConverter');
const specialDomains = require('../../config/specialDomains');
const { dbUpdateImmigrant } = require('../immigrantsDb/repository');
const { log } = require('../../helpers/logger');

/**
 * @param normalizedPerson person
 * @param primaryDomain example: dataSource1
 * @param shadowUsers optional field if there are shadowUsers already
 * starts the correct user creation process and returns true if all created.
 */
module.exports = async (normalizedPerson, primaryDomain, shadowUsers = []) => {

        const personDomains = normalizedPerson.domainUsers.map(domainUser => domainUser.dataSource);
        const shadowDomains = shadowUsers.map(user => user.domainUser);
        const id = normalizedPerson.id;


        if (!personDomains.includes(specialDomains.ads) && !shadowDomains.includes(specialDomains.ads)) {
            console.log('missing ads user, creating');
            // create ads user
            // const adsAdUser = adsConverter(normalizedPerson);
            // await createInAdsOrch(adsAdUser);
            await logAndUpdateDb(id, specialDomains.ads);
            return false;
        }
        else if (!personDomains.includes(specialDomains.es) && !shadowDomains.includes(specialDomains.es) ) {
            console.log('missing es user, creating');
            // create es user
            // const esAdUser = esConverter(normalizedPerson);
            // await createInEsOrch(esAdUser);
            await logAndUpdateDb(id, specialDomains.es);
            return false;
        }
        else if (!personDomains.includes(specialDomains.target) && !shadowDomains.includes(specialDomains.target)) {
            console.log('missing target user, creating');
            // create target user
            // const targetADuser = targetConverter(normalizedPerson);
            // await createInTargetOrch(targetADuser);
            await logAndUpdateDb(id, specialDomains.target);
            return false;
        }

        console.log('done');
        // const targetADuser = targetConverter(normalizedPerson);
        // await createInTargetOrch(targetADuser);
        // console.log(targetADuser);
        // await logAndUpdateDb(id, specialDomains.target);

        return true; // should be true
}

const logAndUpdateDb = async (id, domain) => {
    await dbUpdateImmigrant(id, {'status.step': `${domain}`});
    log(`succesfuly sent user for ${domain} user creation.`, id);
}