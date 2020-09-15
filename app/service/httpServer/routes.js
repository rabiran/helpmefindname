const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { hasId } = require('./validator');
const { status, getAllStatus,
sendPerson, updateStatus } = require('./controller');

router.get('/ruok', wa(status) );
router.get('/candidate', wa(getAllStatus) );
router.post('/candidate', hasId, wa(sendPerson));
router.put('/candidate/', wa(updateStatus));

module.exports = router;