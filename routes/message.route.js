const express = require('express');
const { ADD_TRANSACTION, GET_UNREAD_MSGS, CLEAR_MSGS, GET_ALL_MSGS } = require('../configs/app-config');
const { addTransaction, getUnreadMessages, clearMessages, getAllMessages } = require('../controllers/msg.controller');


const router = express.Router();

router.post(ADD_TRANSACTION, addTransaction);
router.post(GET_UNREAD_MSGS, getUnreadMessages);
router.post(CLEAR_MSGS, clearMessages);
router.post(GET_ALL_MSGS, getAllMessages);

module.exports = router;