const config = require('../../config');
// const personNormalizer = require('./personNormalizer');
const OUbuilder = require('../OUbuilder');

/**
 * @param normalizedPerson  normalized person
 * @param primaryUniqueId used for extensionattr1 and 2, example: T8249024@haha.com
 * returns object with fields for active directory
 */
module.exports = (normalizedPerson, primaryUniqueId, isNewUser, startDate, isUrgent) => {
    // const normalizedPerson = personNormalizer(person);
    // const specialDomainUser = normalizedPerson.domainUsers.find(user => user.dataSource === config.specialDomain);
    const primaryDomainUserNormalized = normalizedPerson.domainUsers.find(user => user.uniqueID === primaryUniqueId);

    // return {
    //     First_Name_Heb: normalizedPerson.firstName,
    //     isNewUser,
    //     Last_Name_Heb: normalizedPerson.lastName,
    //     DisplayName: normalizedPerson.fullName,
    //     Original_domain: primaryDomainUserNormalized.dataSource,
    //     User_Type: normalizedPerson.entityType,
    //     Hierarchy: normalizedPerson.hierarchy.join('/'),
    //     User_Profile: normalizedPerson.job,
    //     Aman_ID: primaryDomainUserNormalized.adfsUID,
    //     Mail: normalizedPerson.mail,
    //     Private_Number: normalizedPerson.personalNumber,
    //     ID_Number: normalizedPerson.identityCard,
    //     Phone_Number: normalizedPerson.mobilePhone[0],
    //     Rank: normalizedPerson.rank,
    // }

    return {
        ID: normalizedPerson.id,
        GivenName: normalizedPerson.firstName,
        DisplayName: normalizedPerson.fullName,
        sn: normalizedPerson.lastName,
        ExtentionAttribute1: primaryDomainUserNormalized.adfsUID,
        ExtentionAttribute2: `${primaryDomainUserNormalized.userName}@${primaryDomainUserNormalized.domainName}`,
        Mail: normalizedPerson.mail,
        SamAccountName: primaryDomainUserNormalized.userName,
        IsNewUser: isNewUser,
        StartDate: startDate,
        IsUrgent: isUrgent
        // StartDate: startDate,
    }

    // return {
    //     ['8cb4d49b-fdb8-46ad-b3d5-4b50099a565e']: normalizedPerson.firstName,
    //     ['ac05c880-f075-4181-905f-9645413f49e8']: normalizedPerson.fullName,
    //     ['375bc88b-a6b6-458d-a832-a7a978d0532f']: normalizedPerson.lastName,
    //     ['708a026a-e87d-4854-b776-b9716a778372']: primaryDomainUserNormalized.adfsUID,
    //     ['49aaf9ca-4c6f-4510-b657-e4c50283950f']: `${primaryDomainUserNormalized.userName}@${primaryDomainUserNormalized.domainName}`,
    //     ['68668a06-e561-4bbc-9812-c70b180e1921']: normalizedPerson.mail,
    //     ['ec1e9375-7c49-4ac3-8740-e20c67cb2a4f']: primaryDomainUserNormalized.userName
    // }

    
    return {
        GivenName: normalizedPerson.firstName,
        SurName: normalizedPerson.lastName,
        Mail: `${specialDomainUser.userName}@${config.specialMailServer}`,
        ExtensionAttribute1: primaryUser.adfsUID,
        ExtensionAttribute2: `${primaryUser.userName}@${primaryUser.domainName}`,
        DistinguishedName: OUbuilder(normalizedPerson.hierarchy),
        UserPrincipalName: `${specialDomainUser.userName}@${config.targetDomain}`
    }

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