const jwt = require('jsonwebtoken')

module.exports=(req,res,next)=>{
    let token = req.headers['authorization'] 

    console.log(token)
    if (token.startsWith('Bearer ')) {
        try{
            token = token.slice(7, token.length);
            const decoded = jwt.verify(token, process.env.secret_key_token)
            req.verified = decoded
            next()
        }catch(error) {
            if(error.name=="TokenExpiredError"){
                res.status(403).json({
                    state: false,
                    message: error.message,
                    expiredToken:token
                })
            }else{
                res.status(401).json({
                    state: false,
                    message: error.message
                })
            }
        }
    }
}