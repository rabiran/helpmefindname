const config = require('../../config');
// const personNormalizer = require('./personNormalizer');
const OUbuilder = require('../OUbuilder');

/**
 * @param normalizedPerson  normalized person
 * @param primaryDomainUser used for extensionattr1 and 2, example: T8249024@haha.com
 * returns object with fields for active directory
 */
module.exports = (normalizedPerson, primaryDS, primaryDomainUser) => {
    // const normalizedPerson = personNormalizer(person);
    const specialDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === config.specialDomain);
    const primaryUser = normalizedPerson.domainUsers.find(user => user.uniqueID === primaryDomainUser);

    return {
        SamAccountName: specialDomainUser.userName,
        DisplayName: normalizedPerson.hierarchy.join('/'),
        GivenName: normalizedPerson.firstName,
        SurName: normalizedPerson.lastName,
        Mail: `${specialDomainUser.userName}@${config.specialMailServer}`,
        ExtensionAttribute1: primaryUser.adfsUID,
        ExtensionAttribute2: `${primaryUser.userName}@${primaryUser.domainName}`,
        DistinguishedName: OUbuilder(normalizedPerson.hierarchy),
        UserPrincipalName: `${specialDomainUser.userName}@${config.targetDomain}`
    }
}