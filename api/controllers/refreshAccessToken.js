const refreshAccessToken_collection = require('../models/refreshAccessToken') 
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
exports.getRefreshAccessToken=(req,res)=>{
    RefreshAccessToken = req.body.ref_token
    /************************************************** */
    /******************generate and return the new token and refresh token ******************* */
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
        decoded = jwt.verify(RefreshAccessToken, process.env.secret_key_refrech_token)
        /******************search for the token in database ******************** */
        await refreshAccessToken_collection.find({ userid: decoded.user_auth._id, ref_token: RefreshAccessToken}).exec().then(async result => {
           /*****if there is token */
            if (result.length > 0) {
                logged_user = {
                    _id:decoded.user_auth._id,
        
                }
                /***create accces token and refresh token */
                token = jwt.sign({ user_auth: logged_user }, process.env.secret_key_token, { expiresIn: "5s" })
                ref_token = jwt.sign({ user_auth: logged_user }, process.env.secret_key_refrech_token)
                /***********************delete old token****** */
              refreshAccessToken_collection.findOneAndRemove({ ref_token:RefreshAccessToken }).exec().then((result)=>{

             /********************************************* */
                /**************save the new token************* */
                const refreshToken_collection = new refreshAccessToken_collection({
                    _id: new Mongoose.Types.ObjectId(),
                    ref_token: ref_token ,
                    userid: decoded.user_auth._id,
                })
                refreshToken_collection.save().then()
               })
   
                /******************************************** */
            } else {

             return  p =  Promise.reject({error: "no token found"})
                }
            }).catch(e=>{
                return  p =  Promise.reject({errorMessage: e.message})

            })
            return  p =  Promise.resolve({token,ref_token})
    } catch (error) {
        return  p =  Promise.reject({errorMessage: error.message})
    }
}
