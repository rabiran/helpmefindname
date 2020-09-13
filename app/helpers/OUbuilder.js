const config = require('../config');
/**
 * @param hierarchy hierarchy array of strings
 * returns OU string;
 */
module.exports = (hierarchy) => {
    
    let OU = '';
    for(let place of hierarchy) {
        OU += `OU=${place} `;
    }
    return OU;
}