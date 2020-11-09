const config = require('../../config');
// const personNormalizer = require('./personNormalizer');
const OUbuilder = require('../OUbuilder');

/**
 * @param normalizedPerson  normalized person
 * @param primaryDomain used for extensionattr1 and 2
 * returns object with fields for active directory
 */
module.exports = (normalizedPerson, primaryDomain) => {
    // const normalizedPerson = personNormalizer(person);
    const specialDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === config.specialDomain);
    const primaryDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === primaryDomain);

    return {
        SamAccountName: specialDomainUser.userName,
        DisplayName: normalizedPerson.hierarchy.join('/'),
        GivenName: normalizedPerson.firstName,
        SurName: normalizedPerson.lastName,
        Mail: `${specialDomainUser.userName}@${config.specialMailServer}`,
        ExtensionAttribute1: primaryDomainUser.adfsUID,
        ExtensionAttribute2: `${primaryDomainUser.userName}@${primaryDomainUser.domainName}`,
        DistinguishedName: OUbuilder(normalizedPerson.hierarchy),
        UserPrincipalName: `${specialDomainUser.userName}@${config.targetDomain}`
    }
}