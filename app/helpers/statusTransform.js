const config = require('../config');

module.exports = (statusEnum) => {
    const statuses = config.statusEnums;
    return statuses[Number(statusEnum)];
}