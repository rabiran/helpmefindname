const orchFormat = require('../config/orchFormatGood');
const xmler = require("xml2json");

/**
 * @param ADuser object with ad fields and values, samAccountName etc
 * returns XML ready to be sent to orch.
 */
module.exports = (ADuser) => {

    const orchJson = {...orchFormat};
    let params = orchJson.entry.content['m:properties']["d:Parameters"].Data.Parameter;

    for(param of params) {
        param.Value = { $t: ADuser[param.ID]}
        param.ID = { $t: param.ID };
    }
    const xml = xmler.toXml(orchJson);
    return xml;
}