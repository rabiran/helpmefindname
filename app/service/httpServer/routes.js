const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { isValidCreation, isValidStepUpdate, isValidGlobalUpdate } = require('./validator');
const { isAuth } = require('./auth');
const { status, getImmigrants,
addImmigrant, updateImmigrant, overrideImmigrant, getImmigrantsByGardener, deleteImmigrant, retryStep, getDomains,getEntityType,getDomainsMap,
getCompletedStats, getGardenerStats, getTotalStats, getExcel, getProgressStats } = require('./controller');

router.get('/health', wa(status) );
router.get('/immigrant', isAuth, wa(getImmigrants) );
router.get('/immigrant/:gardener', isAuth, wa(getImmigrantsByGardener))
router.post('/immigrant', isAuth, isValidCreation, wa(addImmigrant));
router.put('/immigrant/:id', isAuth, isValidStepUpdate, wa(updateImmigrant));
router.put('/immigrant', isAuth, isValidGlobalUpdate, wa(overrideImmigrant));
// router.put('/updatePerson/:id', isAuth, wa())
router.post('/immigrant/retry/:id', isAuth, wa(retryStep));

router.delete('/immigrant/:id', isAuth, wa(deleteImmigrant));

router.get('/stats/completed', isAuth, wa(getCompletedStats));
router.get('/stats/gardeners', isAuth, wa(getGardenerStats));
router.get('/stats/total', isAuth, wa(getTotalStats));
router.get('/stats/statuses', isAuth, wa(getProgressStats));

router.get('/domainsMap',isAuth, wa(getDomainsMap));
router.get('/excel',isAuth, wa(getExcel)); //isAuth!!add 
router.get('/entityType',isAuth, wa(getEntityType));
router.get('/domains',isAuth, wa(getDomains)); //isAuth add

module.exports = router;