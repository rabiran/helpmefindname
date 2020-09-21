const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { isValid } = require('./validator');
const { status, getImmigrants,
    addImmigrant, updateImmigrant } = require('./controller');

router.get('/health', wa(status) );
router.get('/immigrant', wa(getImmigrants) );
router.post('/immigrant', isValid, wa(addImmigrant));
router.put('/immigrant', wa(updateImmigrant));

module.exports = router;