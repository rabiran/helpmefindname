const config = require('../config');
/**
 * @param hierarchy gets hierarchy array
 * returns OU string;
 */
module.exports = (hierarchy) => {
    
    let OU = '';
    for(let place of hierarchy) {
        OU += `OU=${place} `;
    }
    return OU;
}