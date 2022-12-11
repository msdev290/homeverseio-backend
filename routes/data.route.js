const express = require('express');
const { getAllTypes, getAllVideos, searchVideoData, getUserByAddress, getVideoByAddress, streamVideo, getVideoInfo } = require('../controllers/data.controller')
const { GET_ALL_TYPES, GET_ALL_VIDEOS, GET_SEARCH, GET_USER_BY_ADDRESS, GET_DATA_BY_ADDRESS, STREAM_VIDEO, GET_VIDEO_INFO } = require('../configs/app-config');

const router = express.Router();

router.post(GET_ALL_TYPES, getAllTypes);
router.post(GET_ALL_VIDEOS, getAllVideos);
router.post(GET_SEARCH, searchVideoData);
router.post(GET_USER_BY_ADDRESS, getUserByAddress);
router.post(GET_DATA_BY_ADDRESS, getVideoByAddress);
router.post(GET_VIDEO_INFO, getVideoInfo);
router.get(STREAM_VIDEO, streamVideo);

module.exports = router;