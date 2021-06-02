const express = require('express')
const router = express.Router()
const Topic_controler = require('../controllers/dailyTopic_controller')
const check_auth=require("../middleware/check_auth")
router.post('/Addtopic',Topic_controler.Addtopic)
router.post('/getLastTopic',Topic_controler.getLastTopic)
router.post('/getallTopics',Topic_controler.getallTopics)
router.post('/getSpecificTopic',Topic_controler.getSpecificTopic)
module.exports = router
