const config = require("../../config");
const _ = require("lodash");
const xlsx = require("xlsx");

const updateExcel = () => {
  const workbook = xlsx.readFile("./dataSourcesMap.xlsx");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const columnA = [];
  const columnD = [];

  for (let z in worksheet) {
    if (z.toString()[0] === "A") {
      columnA.push(worksheet[z].v);
    }
  }

  for (let z in worksheet) {
    if (z.toString()[0] === "D") {
      columnD.push(worksheet[z].v);
    }
  }
  config.akaAdkatz = columnA;
  config.akaKapaim = columnD;
};

const getExcelJson = () => {
    let obj = {"akaAdkatz": config.akaAdkatz , "akaKapaim": config.akaKapaim};
    return obj;
}

module.exports = {
    getExcelJson, updateExcel
}