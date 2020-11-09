const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { isValid } = require('./validator');
const { isAuth } = require('./auth');
const { status, getImmigrants,
addImmigrant, updateImmigrant, getImmigrantsByGardener, deleteImmigrant, getDomains } = require('./controller');

router.get('/health', wa(status) );
router.get('/immigrant', isAuth, wa(getImmigrants) );
router.get('immigrant/:gardener', isAuth, wa(getImmigrantsByGardener))
router.post('/immigrant', isAuth, isValid, wa(addImmigrant));
router.put('/immigrant', isAuth, wa(updateImmigrant));
router.delete('/immigrant/:id', isAuth, wa(deleteImmigrant));

router.get('domains', wa(getDomains));

module.exports = router;