const express = require('express')
const router = express.Router()
const likes_controler = require('../controllers/image_likes_controller')
const check_auth=require("../middleware/check_auth")

router.post('/addLikeToImage',check_auth, likes_controler.addLikeToImage)
router.post('/checklikeToImage', check_auth,likes_controler.checklikeToImage)
router.post('/dislikeImage',check_auth,likes_controler.dislikeImage)
router.post('/countImageLikes',check_auth,likes_controler.countImageLikes)
router.post('/getLikestUserNameFromImage',check_auth, likes_controler.getLikestUserNameFromImage)

/**************************************************************************/
router.post('/addLikeToCommentImage',check_auth, likes_controler.addLikeToCommentImage)
router.post('/dislikeToCommentImage',check_auth, likes_controler.dislikeToCommentImage)
router.post('/checklikeToCommentImage',check_auth, likes_controler.checklikeToCommentImage)
router.post('/countImageCommentsLikes',check_auth, likes_controler.countImageCommentsLikes)
router.post('/getLikestUserNameFromCommentImage',check_auth, likes_controler.getLikestUserNameFromCommentImage)

/***************************************************************************/

module.exports = router

