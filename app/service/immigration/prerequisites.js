

/**
 * @param person person from kartoffel db or api
 * @param primaryDomain example: dataSource1
 * prepares everything for orchestration and starts the process.
 */
module.exports = async (normalizedPerson) => {

        const personDomains = normalizedPerson.domainUsers.map(domainUser => domainUser.dataSource);

        console.log(personDomains);

        if (!personDomains.includes(specialDomains.dataSource1)) {
            // create dataSource1 user
        }
        else if (!personDomains.includes(specialDomains.dataSource2)) {
            // create dataSource2 user
        }
}