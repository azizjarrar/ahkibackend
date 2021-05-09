const express = require('express')
const router = express.Router()
const user_controler = require('../controllers/user_controller')
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
        cb(null,'./uploads/'+req.verified.user_auth._id+"/images/")
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
        fs.exists('./uploads/'+req.verified.user_auth._id+"/images/", function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/'+req.verified.user_auth._id+"/images/").then(data=>{
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
router.post('/login', user_controler.login)
//router.post('/loginfacebook', user_controler.loginFacebook)
router.post('/register', user_controler.register)
router.get('/GetUserData',check_auth, user_controler.getUserData)
router.post('/changeprofileimage',check_auth,checkUploadPath,uploadMulter.single('file'), user_controler.changeprofileimage)
router.post('/getotherUsersData/:id',check_auth ,user_controler.getotherUsersData)
router.post('/activeAccount',user_controler.activeAccount)
router.post('/reSendVerificationCode',user_controler.reSendVerificationCode)
router.post('/removeToken',user_controler.removeToken)
router.post('/updateProfileInfo',check_auth,user_controler.updateProfileInfo)
router.post('/changePassword',check_auth,user_controler.changePassword)
router.post('/searchAccountToForgetPassword',user_controler.searchAccountToForgetPassword)
router.post('/resetPassword',user_controler.resetPassword)
router.post('/SetNewPassword',user_controler.SetNewPassword)
router.post('/updateEmailSendCode',check_auth,user_controler.updateEmailSendCode)
router.post('/updateEmail',check_auth,user_controler.updateEmail)
router.post('/getrandomUsers',check_auth,user_controler.getrandomUsers)
router.post('/SearchUserByUserName',check_auth,user_controler.SearchUserByUserName)
router.post('/getrandomUsers',check_auth,user_controler.getrandomUsers)
router.post('/getPrivacy',check_auth,user_controler.getPrivacy)
router.post('/updatePrivacy',check_auth,user_controler.updatePrivacy)



module.exports = router
