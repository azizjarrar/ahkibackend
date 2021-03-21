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
        cb(null,'./uploads/'+req.verified.user_auth._id+"/Images/")
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
        fs.exists('./uploads/'+req.verified.user_auth._id+"/Images/", function(exists) {
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
router.get('/getotherUsersData/:id', user_controler.getotherUsersData)
router.post('/activeAccount',user_controler.activeAccount)
router.post('/reSendVerificationCode',user_controler.reSendVerificationCode)
router.post('/removeToken',user_controler.removeToken)
router.post('/updateProfileInfo',check_auth,user_controler.updateProfileInfo)
router.post('/changePassword',check_auth,user_controler.changePassword)
router.post('/searchAccountToForgetPassword',user_controler.searchAccountToForgetPassword)
router.post('/resetPassword',user_controler.resetPassword)//hedhi tab3ethlk il code
router.post('/SetNewPassword',user_controler.SetNewPassword)//hedhi tbadek mdp
router.post('/updateEmailSendCode',check_auth,user_controler.updateEmailSendCode)//hedhi li tab3ath code  lil email jdid li theb tbadlou
router.post('/updateEmail',check_auth,user_controler.updateEmail)//hedhi li tbadel email t3adilha code
router.post('/checkIffollow',check_auth,user_controler.checkIffollow)//tchouf thot btn follow wala unfofllow
router.post('/followUser',check_auth,user_controler.followUser)//tchouf thot btn follow wala unfofllow
router.post('/unfollowUser',check_auth,user_controler.unfollowUser)//tchouf thot btn follow wala unfofllow
router.post('/getFollowing',check_auth,user_controler.getFollowing)//tchouf thot btn follow wala unfofllow
router.post('/getFollowers',check_auth,user_controler.getFollowers)//tchouf thot btn follow wala unfofllow
router.post('/getrandomUsers',user_controler.getrandomUsers)//tchouf thot btn follow wala unfofllow
router.post('/SearchUserByUserName',user_controler.SearchUserByUserName)//tchouf thot btn follow wala unfofllow
router.post('/getFollowersOfUser',check_auth,user_controler.getFollowersOfUser)//tchouf thot btn follow wala unfofllow
router.post('/getFollowingOfUser',check_auth,user_controler.getFollowingOfUser)//tchouf thot btn follow wala unfofllow



module.exports = router
