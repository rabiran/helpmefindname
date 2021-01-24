const orchFormat = require('../config/orchFormatGood');
const xmler = require("xml2json");

/**
 * @param ADuser object with ad fields and values, samAccountName etc
 * returns XML ready to be sent to orch.
 */
module.exports = (ADuser) => {

    const orchJson = {...orchFormat};
    let params = orchJson.entry.content['m:properties']["d:Parameters"].Data.Parameter;
    console.log(params);
    params = [];
    params = Object.keys(ADuser).map((key)=> {
        return {
            ID: { $t: key },
            Value: { $t: ADuser[key]}
        }
    });

    console.log(params);
    orchJson.entry.content['m:properties']["d:Parameters"].Data.Parameter = params;
    // for(param of params) {
    //     param.ID = { $t: param.ID };
    //     param.Value = { $t: ADuser[param.ID]}
    // }
    const xml = xmler.toXml(orchJson);
    return xml;
}