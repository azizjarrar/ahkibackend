const express = require('express')
const router = express.Router()
const user_controler = require('../controllers/chat')
const check_auth=require("../middleware/check_auth")

router.post('/addMessage',check_auth,user_controler.addMessage)
router.post('/getMessagesOfCurrentconversation',check_auth ,user_controler.getMessagesOfCurrentconversation)
router.post('/getUserWhoChatWith',check_auth ,user_controler.getUserWhoChatWith)
router.post('/getUnreadUsersChatsNumber',check_auth ,user_controler.getUnreadUsersChatsNumber)

module.exports = router
