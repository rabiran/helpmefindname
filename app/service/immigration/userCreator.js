
const { createInTargetOrch } = require('../apis');
const targetConverter = require('../../helpers/personConverter/targetConverter');
const specialDomains = require('../../config/specialDomains');

/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * starts the correct user creation process and returns for which domain it started the process.
 */
module.exports = async (normalizedPerson) => {

        const personDomains = normalizedPerson.domainUsers.map(domainUser => domainUser.dataSource);

        console.log(personDomains);

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
        return specialDomains.target;
}