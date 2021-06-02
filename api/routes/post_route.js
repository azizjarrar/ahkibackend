const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/post_controller')
const check_auth=require("../middleware/check_auth")
/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/
const path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
const multer = require('multer')
const crypto = require('crypto')
/********************profile picture multer*********************** */
const storageMulter = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/'+req.verified.user_auth._id+"/postimages/")
    },
    filename:(req,file,cb)=>{
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
             file_name = buf.toString('hex') + path.extname(file.originalname)

             cb(null,file_name)
        })
    }
})
const fileFilter = (req,file,cb)=>{
    
    if(file.mimetype==="video/mp4"|| file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(new Error('type invalide'),false)
    }
}
const uploadMulter = multer({fileFilter:fileFilter,storage:storageMulter})
/**************************check if file exist***************************************/
function checkUploadPath(req, res, next) {
        fs.exists('./uploads/'+req.verified.user_auth._id+"/postimages/", function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/'+req.verified.user_auth._id+"/postimages/").then(data=>{
            next();
        }).catch(error=>{
            console.log('Error in folder creation='+error.message);
            next();
        })
       }
    })
}

/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/
router.post('/addPost',check_auth ,checkUploadPath,uploadMulter.single('postImage'),post_controller.addPost)
router.post('/addDailyTopicPost',check_auth ,checkUploadPath,uploadMulter.single('postImage'),post_controller.addDailyTopicPost)
router.post('/getCurrentUserPosts',check_auth,post_controller.getCurrentUserPosts)
router.post('/getOtherUserPosts', post_controller.getOtherUserPosts)
router.post('/deletePost', check_auth,post_controller.deletePost)
router.post('/getFriendsPosts', check_auth,post_controller.getFriendsPosts)
router.post('/getTodayTopicPost',post_controller.getTodayTopicPost)
router.post('/getTopUserPostsLikes',post_controller.getTopUserPostsLikes)
router.post('/getSelectedTopicPosts',post_controller.getSelectedTopicPosts)

module.exports = router
