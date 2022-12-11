const express = require('express');
const { CONNECT_WALLET,UPLOAD, UPGRADE_PLAN, PURCHASE_VIDEO, FOLLOW_VIDEO, UPDATE_VIEWS } = require('../configs/app-config');
const { connectWallet, upgradeUserPlan, purchaseNewVideo, uploadData, updateViews, followVideo } = require('../controllers/user.controller');
const multer = require('multer');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})

router.post(CONNECT_WALLET, connectWallet);
router.post(UPGRADE_PLAN, upgradeUserPlan);
router.post(PURCHASE_VIDEO, purchaseNewVideo);
router.post(UPLOAD, upload.fields([{name:"image"},{name:"video"}]), uploadData);
router.post(UPDATE_VIEWS, updateViews);
router.post(FOLLOW_VIDEO, followVideo);

module.exports = router;