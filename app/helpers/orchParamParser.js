const { json } = require("express");
const xmler = require("xml2json");

/**
 * @param xml xml with runbook parameters
 */
module.exports = (xml) => {

    const jsonParams = JSON.parse(xmler.toJson(xml));
    const paramEntries = jsonParams.feed.entry;
    const params = {};
    paramEntries.forEach(entry => {
        const props = entry.content['m:properties'];
            params[props['d:Name']] =  props['d:Id']['$t'];
    });
    return params;
}