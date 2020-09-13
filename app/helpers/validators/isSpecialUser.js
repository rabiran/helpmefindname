const config = require('../../config');

/**
 * Validates that the user has only special domainUser, returns the user or null
 * @param person person
 */
module.exports = (person) => {
    return person.domainUsers.find(user => user.dataSource === config.specialDomain);
}