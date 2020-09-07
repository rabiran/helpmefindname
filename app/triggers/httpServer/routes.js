const express = require('express');
const router = express.Router();
const wa = require('../../helpers/utils/wrapAsync');
const { hasId } = require('./validator');
const { status, getAllStatus,
sendPerson, updateStatus } = require('./controller');

router.get('/', wa(status) );
router.get('/statuses', wa(getAllStatus));
router.post('/sendPerson', hasId,  wa(sendPerson));
router.post('/status', wa(updateStatus));

// router.post('/test', async (req, res)=> {
//     sleep(2000).then(()=>{
//         console.log('hey');
//     });
    
//     res.send('yes');
// })
module.exports = router;