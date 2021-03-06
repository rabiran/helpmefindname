const config = require('../config');

/**
 * @param person person from kartoffel db or api
 * returns a person with modified domainUser objects ready for conversion.
 */
module.exports = (person) => {

    const normalizedPerson = normalizeID(person);

    if(!normalizedPerson.domainUsers) {
        throw new Error('has no domainUsers');
    }

    const domainUsers = normalizedPerson.domainUsers.map(dUser => {
        let userName, domainName, adfsUID, uniqueID;

        if(dUser.name) {
            userName = dUser.name;
            domainName = dUser.domain;
            adfsUID = 'TBD';
            uniqueID = `${userName}@${domainName}`;
        }
        else {
            const splitedUser = dUser.uniqueID.split('@');
            userName = splitedUser[0];
            domainName = splitedUser[1];
            adfsUID = dUser.adfsUID;
            uniqueID = dUser.uniqueID;
        }

        return {
            dataSource: dUser.dataSource,
            userName: userName,
            domainName: domainName,
            adfsUID: adfsUID,
            uniqueID
        }
    });

    return {...normalizedPerson, domainUsers};
}

/**
 * @param person person from kartoffel db or api
 * returns a person with normalized id, always id and not _id.
 */
const normalizeID = person => {
    const isDbPerson = person.domainUsers[0].name ? true : false;
    let id;

    if(isDbPerson) {
        id = person._id;
        delete person._id;
    }
    else {
        id = person.id;
        delete person.id;
    }

    return {...person, id};
} 

