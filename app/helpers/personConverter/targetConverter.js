const config = require('../../config');
// const personNormalizer = require('./personNormalizer');
const OUbuilder = require('../OUbuilder');

/**
 * @param normalizedPerson  normalized person
 * @param primaryDomainUser used for extensionattr1 and 2, example: T8249024@haha.com
 * returns object with fields for active directory
 */
module.exports = (normalizedPerson, primaryDomainUser, isNewUser) => {
    // const normalizedPerson = personNormalizer(person);
    // const specialDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === config.specialDomain);
    const primaryDomainUserNormalized = normalizedPerson.domainUsers.find(user => user.uniqueID === primaryDomainUser.uniqueID);

    return {
        First_Name_Heb: normalizedPerson.firstName,
        isNewUser,
        Last_Name_Heb: normalizedPerson.lastName,
        DisplayName: normalizedPerson.fullName,
        Original_domain: primaryDomainUserNormalized.dataSource,
        User_Type: normalizedPerson.entityType,
        Hierarchy: normalizedPerson.hierarchy.join('/'),
        User_Profile: normalizedPerson.job,
        Aman_ID: primaryDomainUserNormalized.adfsUID,
        Mail: normalizedPerson.mail,
        Private_Number: normalizedPerson.personalNumber,
        ID_Number: normalizedPerson.identityCard,
        Phone_Number: normalizedPerson.mobilePhone[0],
        Rank: normalizedPerson.rank,
    }

    //     GivenName: normalizedPerson.firstName,
    //     SurName: normalizedPerson.lastName,
    //     Mail: `${specialDomainUser.userName}@${config.specialMailServer}`,
    //     ExtensionAttribute1: primaryUser.adfsUID,
    //     ExtensionAttribute2: `${primaryUser.userName}@${primaryUser.domainName}`,
    //     DistinguishedName: OUbuilder(normalizedPerson.hierarchy),
    //     UserPrincipalName: `${specialDomainUser.userName}@${config.targetDomain}`
    // }

    // {
    //     "runBookId": "923324-32493249a-3943294",
    //     "First_Name_Heb": "aa",
    //     "Last_Name_Heb": "bb",
    //     "DisplayName": "cc",
    //     "Original_domain": "ads",
    //     "User_Type": "Civilian",
    //     "Hierarchy": "a/b/c/d/f",
    //     "User_Profile": "Job?",
    //     "Aman_ID": "Original domain adfsuid, 935345@bamba",
    //     "Mail": "mail",
    //     "Private_Number": "93258235",
    //     "ID_Number": "9435435",
    //     "Phone_Number": "9353450-345435",
    //     "Rank": "raal"
    //  }
     
}