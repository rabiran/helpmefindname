const config = require('../config');
// const personNormalizer = require('./personNormalizer');
const OUbuilder = require('./OUbuilder');

/**
 * @param normalizedPerson a person
 * returns object with fields for active directory
 */
module.exports = (normalizedPerson) => {
    // const normalizedPerson = personNormalizer(person);
    const specialDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === config.specialDomain);

    return {
        SamAccountName: specialDomainUser.userName,
        DisplayName: normalizedPerson.hierarchy.join('/'),
        GivenName: normalizedPerson.firstName,
        SurName: normalizedPerson.lastName,
        Mail: `${specialDomainUser.userName}@${config.specialMailServer}`,
        ExtensionAttribute1: specialDomainUser.adfsUID,
        ExtensionAttribute2: `${specialDomainUser.userName}@${specialDomainUser.domainName}`,
        DistinguishedName: OUbuilder(normalizedPerson.hierarchy),
        UserPrincipalName: `${specialDomainUser.userName}@${config.targetDomain}`
    }
}