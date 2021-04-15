const refreshAccessToken_collection = require('../models/refreshAccessToken') 
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
exports.getRefreshAccessToken=(req,res)=>{
    RefreshAccessToken = req.body.ref_token
    /******************************************************************************************/
    /******************generate and return the new token and refresh token ********************/
    /******************************************************************************************/

    setNewRefreshAccessToken(RefreshAccessToken).then(data => {
        res.status(res.statusCode).json({
            message: "new token",
            token: data.token,
            ref_token: data.ref_token,
            status: res.statusCode
        })
    }).catch(error => {
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })
    })
}
setNewRefreshAccessToken=async (RefreshAccessToken)=>{

    let token;
    let ref_token;
    try {

        /**decode refresh token  */

        decoded = await jwt.verify(RefreshAccessToken, process.env.secret_key_refrech_token)
        /******************search for the token in database ******************** */
       let result = await refreshAccessToken_collection.find({ userid: decoded.user_auth._id, ref_token: RefreshAccessToken}).exec()
           /*****if there is token */
            if (result.length > 0) {
                logged_user = {
                    _id:decoded.user_auth._id,
                }
                /***create accces token and refresh token */
                token = await jwt.sign({ user_auth: logged_user }, process.env.secret_key_token, { expiresIn: "86400s" })
                ref_token = await jwt.sign({ user_auth: logged_user }, process.env.secret_key_refrech_token)
                /***********************delete old token****** */

                /********************************************* */
                /**************save the new token************* */
                const refreshToken_collection = new refreshAccessToken_collection({
                    _id: new Mongoose.Types.ObjectId(),
                    ref_token: ref_token ,
                    userid: decoded.user_auth._id,
                })
               await  refreshToken_collection.save().then()
               
   
                /******************************************** */
            } else {
             return  p =  Promise.reject({error: "no token found"})
            }
            
            return  p =  Promise.resolve({token,ref_token})
    } catch (error) {
        return  p =  Promise.reject({errorMessage: error})
    }
}

exports.deleteRefrechTokenOldOne=async (req,res)=>{
    await refreshAccessToken_collection.findOneAndRemove({ ref_token:req.body.RefreshAccessToken }).exec().then(result=>{
        res.status(res.statusCode).json({
            message: "tfasa5",
            status: res.statusCode
        })
    }).catch(e=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })
    })

}
