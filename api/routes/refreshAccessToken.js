const express = require('express')
const router = express.Router()
const user_controler = require('../controllers/refreshAccessToken')
router.post('/getRefreshAccessToken', user_controler.getRefreshAccessToken)

module.exports = router
