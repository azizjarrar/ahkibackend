const express = require('express')
const router = express.Router()
const postNrmlTopic_controller = require('../controllers/postNrmlTopic_controller')
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
        cb(null,'./uploads/'+req.verified.user_auth._id+"/NrmlTopicImages/")
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

    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(new Error('type invalide'),false)
    }
}
const uploadMulter = multer({fileFilter:fileFilter,storage:storageMulter})
/**************************check if file exist***************************************/
function checkUploadPath(req, res, next) {
        fs.exists('./uploads/'+req.verified.user_auth._id+"/NrmlTopicImages/", function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/'+req.verified.user_auth._id+"/NrmlTopicImages/").then(data=>{
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
router.post('/addPost',check_auth ,checkUploadPath,uploadMulter.single('postImage'),postNrmlTopic_controller.addPost)
router.post('/getCurrentUserPosts',check_auth,postNrmlTopic_controller.getCurrentUserPosts)
router.post('/getOtherUserPosts', postNrmlTopic_controller.getOtherUserPosts)

module.exports = router
