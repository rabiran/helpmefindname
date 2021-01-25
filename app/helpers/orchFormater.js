const orchFormat = require('../config/orchFormatGood');
const xmler = require("xml2json");

/**
 * @param data object with ad fields and values, samAccountName etc
 * returns XML ready to be sent to orch.
 */
module.exports = (data, runBookId) => {

    const orchJson = {...orchFormat};
    orchJson.entry.content['m:properties']["d:RunbookId"].$t = `{${runBookId}}`;
    let params = orchJson.entry.content['m:properties']["d:Parameters"].data.Parameter;
    console.log(params);
    params = [];
    params = Object.keys(data).map((key)=> {
        return {
            ID: { $t: key },
            Value: { $t: data[key]}
        }
    });

    console.log(params);
    orchJson.entry.content['m:properties']["d:Parameters"].data.Parameter = params;
    // for(param of params) {
    //     param.ID = { $t: param.ID };
    //     param.Value = { $t: data[param.ID]}
    // }
    const xml = xmler.toXml(orchJson);
    return xml;
}