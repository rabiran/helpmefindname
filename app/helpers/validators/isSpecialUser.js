const config = require('../../config');

/**
 * Validates that the user has only special domainUser, returns the user or null
 * @param dbPerson db user from kartoffel
 */
module.exports = (dbPerson) => {
    return dbPerson.domainUsers.find(user => user.dataSource === config.specialDomain);
}