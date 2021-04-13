const express = require('express')
const router = express.Router()
const notification_controller = require('../controllers/notification_controller')
const check_auth=require("../middleware/check_auth")

router.post('/getnotifications',check_auth, notification_controller.getnotifications)


module.exports = router
