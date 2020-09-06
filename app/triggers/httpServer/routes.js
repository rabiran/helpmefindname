const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { status, getAllStatus,
sendPerson, updateStatus } = require('./controller');

router.get('/', wa(status) );
router.get('/status', wa(getAllStatus));
router.post('/sendPerson', wa(sendPerson));
router.post('/status', wa(updateStatus));

module.exports = router;