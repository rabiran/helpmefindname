const orchFormat = require('../config/orchFormatGood');
const xmler = require("xml2json");

/**
 * @param data object with ad fields and values, samAccountName etc
 * returns XML ready to be sent to orch.
 */
module.exports = (data, runBookId) => {

    const orchJson = {...orchFormat};
    orchJson.entry.content['m:properties']["d:RunbookId"].$t = `{${runBookId}}`;
    let params = orchJson.entry.content['m:properties']["d:Parameters"].Data.Parameter;
    params = [];
    params = Object.keys(data).map((key)=> {
        return {
            ID: { $t: key },
            Value: { $t: data[key]}
        }
    });
    orchJson.entry.content['m:properties']["d:Parameters"].Data.Parameter = params;
    const gibrishExample = '&lt;Data&gt;&lt;Parameter&gt;&lt;ID&gt;{18d6e973-f72f-4abf-bd5d-f035dc4dd75e}&lt;/ID&gt;&lt;Value&gt;ajaja&lt;/Value&gt;&lt;/Parameter&gt;&lt;/Data&gt;';
    const openTag = '&lt;';
    const closeTag = '&gt;';

    let gibrish = '';
    gibrish+=openTag;
    gibrish+='Data';
    gibrish+=closeTag;
    
    Object.keys(data).forEach((key)=> {
        // let param = [];
        gibrish+=openTag;
        gibrish+='Parameter';
        gibrish+=closeTag;

        gibrish+=openTag;
        gibrish+='ID';
        gibrish+=closeTag;
        gibrish+=`{${key}}`;
        gibrish+=openTag;
        gibrish+='/ID';
        gibrish+=closeTag;

        gibrish+=openTag;
        gibrish+='Value';
        gibrish+=closeTag;
        gibrish+=`{${data[key]}}`;
        gibrish+=openTag;
        gibrish+='/Value';
        gibrish+=closeTag;

        console.log("============");
        console.log(data[key]);
        // gibrish.+=(param);
    });

    gibrish+=openTag;
    gibrish+='/Data';
    gibrish+=closeTag;

    orchJson.entry.content['m:properties']["d:Parameters"] = { $t: gibrish };
    // for(param of params) {
    //     param.ID = { $t: param.ID };
    //     param.Value = { $t: data[param.ID]}
    // }
    const xml = xmler.toXml(orchJson);
    return xml;
}