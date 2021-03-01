const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { isValidPost, isValidPut, isValidInit } = require('./validator');
const { isAuth } = require('./auth');
const { status, getImmigrants,
addImmigrant, updateImmigrant, initImmigrant, getImmigrantsByGardener, deleteImmigrant, retryStep, getDomains,
getCompletedStats, getGardenerStats, getTotalStats, getExcel } = require('./controller');

router.get('/health', wa(status) );
router.get('/immigrant', isAuth, wa(getImmigrants) );
router.get('/immigrant/:gardener', isAuth, wa(getImmigrantsByGardener))
router.post('/immigrant', isAuth, isValidPost, wa(addImmigrant));
router.put('/immigrant/:id', isAuth, isValidPut, wa(updateImmigrant));
router.put('/immigrant/init/:id', isAuth, isValidInit, wa(initImmigrant));
// router.put('/updatePerson/:id', isAuth, wa())
router.post('/immigrant/retry/:id', isAuth, wa(retryStep));

router.delete('/immigrant/:id', isAuth, wa(deleteImmigrant));

router.get('/stats/completed', wa(getCompletedStats));
router.get('/stats/gardeners', wa(getGardenerStats));
router.get('/stats/total', wa(getTotalStats));
// router.get('/stata', wa(getDomains));

router.get('/excel', isAuth, wa(getExcel))

router.get('/domains', wa(getDomains));

module.exports = router;