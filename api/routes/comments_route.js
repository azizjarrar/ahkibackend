const express = require('express')
const router = express.Router()
const comments_controler = require('../controllers/comment_controller')
const check_auth=require("../middleware/check_auth")

router.post('/addComment',check_auth ,comments_controler.addComment)
router.post('/getComments', comments_controler.getComments)

module.exports = router
