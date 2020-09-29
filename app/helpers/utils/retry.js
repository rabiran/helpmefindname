const sleep = require('./sleep');

const retry = async (fn, ms=500, retries=3) => {
    return await fn().catch(async (err) => {
        if(!--retries) throw new Error(err);
        console.log(`failed, ${retries} tries left`);
        await sleep(ms);
        await retry(fn, ms, retries);
    })
}

module.exports = { retry }