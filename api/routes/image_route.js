const express = require('express')
const router = express.Router()
const image_controler = require('../controllers/image_controller')
const check_auth=require("../middleware/check_auth")

router.post('/getImageData',check_auth ,image_controler.getImageData)

module.exports = router
