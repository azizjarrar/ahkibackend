const user_collection = require("../models/user");
const refreshAccessToken_collection = require('../models/refreshAccessToken') 
const bcrypt = require("bcrypt");
const ENV = require("dotenv");
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
var handlebars = require('handlebars');
const fs = require("fs");
var nodemailer = require('nodemailer');
ENV.config();

exports.register = async (req, res) => {
  var tel,dialCode,email,saltRounds,hasdhedPassword,password,userName,age;
  var result
  var User
  /*test if user logged with telephone or email*/
  try {
    if(req.body.tel!=undefined){
        tel = req.body.tel.slice(req.body.dialCode.length,req.body.tel.length);
        result  = await   user_collection.findOne({tel:tel}).exec()
        dialCode = req.body.dialCode
        saltRounds = await bcrypt.genSalt(10);
        hasdhedPassword = await bcrypt.hash(req.body.password, saltRounds);
        password = hasdhedPassword;
        userName = req.body.userName;
        age=req.body.birthDay
         User = new user_collection({
          _id: new Mongoose.Types.ObjectId(),
          biography:"Taking chances almost always makes for happy endings.",
          userName,
          password,
          dialCode,
          tel,
          age,
          verified:false
        });
    }else{
       result  = await   user_collection.findOne({email:req.body.email}).exec()
       saltRounds = await bcrypt.genSalt(10);
       hasdhedPassword = await bcrypt.hash(req.body.password, saltRounds);
       email=req.body.email
       password = hasdhedPassword;
       userName = req.body.userName;
       age=req.body.birthDay
       User = new user_collection({
        _id: new Mongoose.Types.ObjectId(),
        biography:"Taking chances almost always makes for happy endings.",
        userName,
        password,
        age,
        email,
        verified:false,
      });
    }
      var error = User.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: "invalid user",
          status: res.statusCode,
          state:false
        });
        return 
      }
      if(result!=null){
        res.status(res.statusCode).json({
          message: "user alredy exist",
          status: res.statusCode,
          state:false
        });
      }else{
          User.save().then(async (result) => {
            let userData
            //kenou bi tel connected aba3hlou msg  lil tel ken bil eamil aba3thlo code lil email
            if(req.body.email!=undefined){
              let randomNumber=Math.floor((Math.random() * 89999) + 10000)
               userData= await user_collection.findOneAndUpdate({ email: User.email}, { $set: {verifiedCode:randomNumber} }, { new: true }).exec()
              sendCode(randomNumber,"email",User.email,"")
 
            }else{
              let randomNumber=Math.floor((Math.random() * 89999) + 10000)
              userData= await user_collection.findOneAndUpdate({ tel: User.tel}, { $set: {verifiedCode:randomNumber} }, { new: true }).exec()
             //sendCode(randomNumber,"tel","",req.body.tel)
            }
            res.status(res.statusCode).json({
              message: "user has been created",
              result,
              userid:userData._id,
              state:true
            });
          }).catch(e=>{
            console.log(e.message)
          });
        }
      
  } catch (err) {
    res.status(res.statusCode).json({
      message: err.message,
    });
  }
};
/*
exports.loginFacebook = async (req, res) => {

  const userdata = await user_collection.findOne({idfacebook:req.body.id}).exec();
  if(userdata){
    const user_data = {
      _id: userdata._id,
  };
     jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '30m' },
      async (err, token) => {
        if(err){
          res.status(res.statusCode).json({
            message: err.message,
            status: res.statusCode,
            state: false,
          });
        }else{
          //creation fo refreshToken
          const ref_token = await jwt.sign({ user_auth: user_data }, process.env.secret_key_refrech_token,{ expiresIn: '365d'} )
          /***Create new refToken */
          /*
           const refreshAccessToken= new refreshAccessToken_collection({
              _id: new Mongoose.Types.ObjectId(),
              ref_token:ref_token,
              userid: user_data._id,
          })
          refreshAccessToken.save().then()
            res.status(res.statusCode).json({
              message: "login succeeded",
              token: token,
              ref_token:ref_token,
              state: true,
            });
        }

      },
      
    );

  }else{
    const idfacebook=req.body.id;
    const userProfileImageUrl=req.body.urlImage
    const User = new user_collection({
      _id: new Mongoose.Types.ObjectId(),
      biography:"Taking chances almost always makes for happy endings.",
      userName:Math.random().toString(36).substring(7),
      idfacebook,
      userProfileImageUrl,
    });
    User.save().then( () => {
      const newUserInfo= {
        _id: User._id,
    };
       jwt.sign({ user_auth: newUserInfo },process.env.secret_key_token,{ expiresIn: '30m' },
      async (err, token) => {
        if(err){
          res.status(res.statusCode).json({
            message: err.message,
            status: res.statusCode,
            state: false,
          });
        }else{
          //creation fo refreshToken
          const ref_token = await jwt.sign({ user_auth: newUserInfo }, process.env.secret_key_refrech_token,{ expiresIn: '365d'} )
          /***Create new refToken */
           /*const refreshAccessToken= new refreshAccessToken_collection({
              _id: new Mongoose.Types.ObjectId(),
              ref_token:ref_token,
              userid: newUserInfo._id,
          })
          refreshAccessToken.save().then(()=>{
            res.status(res.statusCode).json({
              message: "login succeeded",
              token: token,
              ref_token:ref_token,
              state: true,
            });
          })
        }
      },
    );
    }).catch(e=>{
      console.log(e)
    });
  }

}
*/
exports.login = async (req, res) => {
  const userdata = await user_collection.findOne({$or:[{ tel: req.body.identity} ,{email:req.body.identity}]}).exec();
  if (userdata != null) {

  if (await bcrypt.compare(req.body.password, userdata.password)) {
    if(userdata.verified=="false"){
      res.status(res.statusCode).json({
        message: "not verified",
        userid: userdata._id,
        status: res.statusCode,
        verified:false,
      });
    }else{
      const user_data = {
        tel: req.body.tel,
        _id: userdata._id,
        verified:userdata.verified
    };
     await jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '1h' },
     async (err, token) => {
        if(err){
          res.status(res.statusCode).json({
            message: err.message,
            status: res.statusCode,
            state: false,
          });
        }else{
        //creation fo refreshToken
        const ref_token = await jwt.sign({ user_auth: user_data }, process.env.secret_key_refrech_token,{ expiresIn: '365d'} )
        /***Create new refToken */
         const refreshAccessToken= new refreshAccessToken_collection({
            _id: new Mongoose.Types.ObjectId(),
            ref_token:ref_token,
            userid: user_data._id,
        })
        refreshAccessToken.save().then()
          res.status(res.statusCode).json({
            message: "login succeeded",
            token: token,
            ref_token:ref_token,
            state: true,
          });
        }

      },
      
    );
    }
    } else {
      res.status(res.statusCode).json({
        message: "password incorrect",
        status: res.statusCode,
        state: false,

      });
    }
  } else {
    res.status(res.statusCode).json({
      message: "user not found",
      status: res.statusCode,
      state: false,

    });
  }

};
exports.updateProfileInfo = (req, res) => {
  const userName = req.body.userName;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const age = req.body.age;
  const biography= req.body.biography
  let params = {
    userName,
    firstname,
    lastname,
    biography,
    age,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  user_collection.findOneAndUpdate({ _id: req.verified.user_auth._id}, { $set: params }, { new: true }).select('userName firstname lastname biography age')
    .exec((err, item) => {
      if(err){
        res.status(res.statusCode).json({
          message: err.message,
          status: res.statusCode,
        });
      }else{
        res.status(res.statusCode).json({
          data: item,
          message: "user was updated",
          status: res.statusCode,
        });
      }

    });
};
exports.updatePics = async (req, res) => {
  user_collection.findOneAndUpdate(
    { _id: req.verified.user_auth._id },
    { $set: { pics: newPicsP } },
    { new: true }
  ).exec().
  then((userdata)=>{
    try {
      fs.unlinkSync(userdata.userProfileImageUrl.url.slice(1, userProfileImageUrl.url.length));
      res.status(res.statusCode).json({
        data: userdata.userProfileImageUrl,
        message: "pic was updated",
        status: res.statusCode,
      });
    } catch (err) {
      res.status(res.statusCode).json({
        message: err.message,
        status: res.statusCode,
      });
  
    }
  }).catch(e=>{
    res.status(res.statusCode).json({
      message: e.message,
      status: res.statusCode,
    });
  });

};
exports.changePassword=async (req,res)=>{
  let oldpasswor=req.body.oldPassword;
  let newPassword=req.body.newPassword
  if(newPassword.length<8){
    res.status(res.statusCode).json({
      message: "password is less then 8 char",
      state: false,
    });
  }else{
    if(oldpasswor==undefined || newPassword==undefined){
      res.status(res.statusCode).json({
        message: "set Password",
        state: false,
      });
    }else{
      const userdata = await user_collection.findOne({  _id: req.verified.user_auth._id}).exec();
      const saltRounds = await bcrypt.genSalt(10);
      const hasdhedPassword = await bcrypt.hash(newPassword, saltRounds);
    
      if (await bcrypt.compare(oldpasswor, userdata.password)) {
        user_collection.findOneAndUpdate({  _id: req.verified.user_auth._id},{$set :{password:hasdhedPassword}}).exec().then(()=>{
          res.status(res.statusCode).json({
            message: "password has been changed",
            state: true,
          });
        })
      } else {
        res.status(res.statusCode).json({
          message: "password incorrect",
          passwordincorrect:true,
          state: false,
        });
      }
    }
  } 
}
exports.updatePhoneNumber=async (req,res)=>{
  const tel = req.body.tel.slice(req.body.dialCode.length,req.body.tel.length);
  const dialCode = req.body.dialCode
  user_collection.findOne({tel:tel}).exec().then(data=>{
    if(data){
      res.status(res.statusCode).json({
        message: "Phone number already used",
        status: res.statusCode,
      });
    }else{
      user_collection.findOneAndUpdate({ _id: req.verified.user_auth._id },{ $set: { tel,dialCode } },{ new: true }).exec().then(data=>{
        res.status(res.statusCode).json({
          message: "Phone Number was Updated",
          status: res.statusCode,
        });
      }).catch(error=>{
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
        });
      });
    }
  })
}
exports.FollowUser=(req,res)=>{


}
exports.UnFollowUser=(req,res)=>{

}
exports.getUserData=(req,res)=>{
  /*user_collection.findOne({ _id: req.verified.user_auth._id }).exec().then(result=>{
    res.status(res.statusCode).json({
      data: result,
      status: res.statusCode,
    });
  })*/
  try{
    user_collection.aggregate([{$match:{ _id: Mongoose.Types.ObjectId(req.verified.user_auth._id) }},{$project: { userProfileImageUrl:1,tel:1,biography : 1,userName:1,firstname:1,lastname:1,age:1,following: { $size:"$following" },followers: { $size:"$followers" }}}]).exec().then(result=>{
      res.status(res.statusCode).json({
        data: result,
        status: res.statusCode,
      });
    })
  }catch(e){
    res.status(res.statusCode).json({
      message: e.message,
      status: res.statusCode,
    });
  }
}
exports.getotherUsersData=async (req,res)=>{
    try{
  user_collection.aggregate([{$match:{ _id: Mongoose.Types.ObjectId(req.params.id) }},{$project: { userProfileImageUrl:1,biography : 1,userName:1,firstname:1,lastname:1,following: { $size:"$following" },followers: { $size:"$followers" }}}]).exec().then(result=>{
    res.status(res.statusCode).json({
      data: result,
      status: res.statusCode,
    });
  })
}catch(e){
  res.status(res.statusCode).json({
    message: e.message,
    status: res.statusCode,
  });
}
}

exports.changeprofileimage=async (req,res)=>{
 // const publicIp = require('public-ip');
//	console.log(await publicIp.v4());
  let data = await user_collection.findOneAndUpdate({ _id: req.verified.user_auth._id}, { $set: {userProfileImageUrl:process.env.ip+req.file.path} }, { new: true }).select('userProfileImageUrl').exec().then(()=>{
    res.status(res.statusCode).json({
      Picurl: process.env.ip+req.file.path,
      status: res.statusCode,
    });
  }).catch(e=>{
    res.status(res.statusCode).json({
      message: e.statusCode,
    });
  })

}

exports.activeAccount = async (req, res) => {
  user_collection.findOneAndUpdate( {_id: Mongoose.Types.ObjectId(req.body.userid),verifiedCode:req.body.verificationCode,verified:false},{$set:{verified:true}}).exec().then(async result=>{
    if(result==null){
      res.status(res.statusCode).json({
        message: "invalid  code",
        state: false,
      });
    }else{
      const user_data = {
        _id: result._id,
    };
      await jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '1h' },
      async (err, token) => {
         if(err){
           res.status(res.statusCode).json({
             message: err.message,
             status: res.statusCode,
             state: false,
           });
         }else{
         //creation fo refreshToken
         const ref_token = await jwt.sign({ user_auth: user_data }, process.env.secret_key_refrech_token,{ expiresIn: '365d'} )
         /***Create new refToken */
          const refreshAccessToken= new refreshAccessToken_collection({
             _id: new Mongoose.Types.ObjectId(),
             ref_token:ref_token,
             userid: user_data._id,
         })
         refreshAccessToken.save().then()
           res.status(res.statusCode).json({
             message: "login succeeded",
             token: token,
             ref_token:ref_token,
             state: true,
           });
         }
  
       },
     );
    }
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
    });
  })
}
exports.reSendVerificationCode = async (req, res) => {

  let randomNumber=Math.floor((Math.random() * 89999) + 10000)
  userData= await user_collection.findOneAndUpdate({ _id: Mongoose.Types.ObjectId(req.body.userid)}, { $set: {verifiedCode:randomNumber} }, { new: true }).exec().then(result=>{
    res.status(res.statusCode).json({
      message: "code teb3ath",
      status: res.statusCode,
    });

    sendCode(randomNumber,"email",result.email,"")

  })
  
}

/*****************************************/
const sendCode=(codeNumber,telOrEmail,email="",tel="")=>{
  
  if(telOrEmail="email"){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tripelbil@gmail.com',
        pass: '523307662023'
      }
    });
    
    var readHTMLFile = function(path, callback) {
      fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
          if (err) {
              throw err;
              callback(err);
          }
          else {
              callback(null, html);
          }
      });
  };
    readHTMLFile('./mailTemplate.html', function(err, html) {
      var template = handlebars.compile(html);
      var replacements = {
           code: codeNumber
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
          from: 'my@email.com',
          to : email,
          subject : 'test subject',
          html : htmlToSend
       };
       transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  });
  }

}
exports.removeToken=(req,res)=>{
  refreshAccessToken_collection.findOneAndRemove({userid:Mongoose.Types.ObjectId(req.body.userid)}).exec()
}
//hedhi awel etapge fi forget password tchoud l3abed mawjoud wala le
exports.searchAccountToForgetPassword=(req,res)=>{
  telOrEmail=req.body.identity;
  if(telOrEmail!=undefined && telOrEmail.length>0){
    user_collection.findOne({$or:[ {email:telOrEmail},{tel:telOrEmail}]}).select("userName userProfileImageUrl email tel").exec().then(result=>{
      if(result==null){
        res.status(res.statusCode).json({
          message: "user Not Found",
          status: res.statusCode,
          state:false
        });
      }else{
        res.status(res.statusCode).json({
          message: "user Found",
          data:result,
          status: res.statusCode,
          state:true
        });
      }
    })
  }else{
    res.status(res.statusCode).json({
      message: "hout user",
      status: res.statusCode,
      state:false
    });
  }

}
//hedhi theni etape fi tarji3 il mdp taba3th code li chi ged bih pass jdid
exports.resetPassword=(req,res)=>{
  if(req.body.type=="email"){
    let randomNumber=Math.floor((Math.random() * 89999) + 10000)

    user_collection.findOneAndUpdate({email:req.body.email},{$set:{resetPassword:{ExpiresIn:Date.now(),code:randomNumber}}}).exec().then(result=>{
      if(result!=undefined){
        sendCode(randomNumber,"email",result.email,"")
        res.status(res.statusCode).json({
          message: "code teb3ath",
          data:randomNumber,
          status: res.statusCode,
          state:true
        });
      }else{
        res.status(res.statusCode).json({
          message: "user Not Found",
          status: res.statusCode,
          state:false
        });
      }
    })
  }else{
    //telephone
    user_collection.findOneAndUpdate({tel:req.body.tel}).exec().then(result=>{
        if(result!=undefined){
        
        }else{
          res.status(res.statusCode).json({
            message: "user Not Found",
            status: res.statusCode,
            state:false
          });
        }
    })
  }
  
}
//hedhi e5er marhla fi tarji3 mdp t3adi il code ou mdp jdid ou khw yetbadel pas
exports.SetNewPassword=(req,res)=>{
;
  if(req.body.type=="email"){
    user_collection.findOne({email:req.body.identity}).exec().then(async result=>{
      if(result.resetPassword.code!=req.body.code){
        res.status(res.statusCode).json({
          message: "Code raw 8alet",
          status: res.statusCode,
          typeError:"incorectCode",
          state:false
        });
      }else if(result.resetPassword.ExpiresIn+(60*60)<Date.now()){
        res.status(res.statusCode).json({
          message: "Code raw ofe wa9tou",
          typeError:"codeInvalid",
          status: res.statusCode,
          state:false
        });
      }else{
        saltRounds = await bcrypt.genSalt(10);
        hasdhedPassword = await bcrypt.hash(req.body.newPassword, saltRounds)
        user_collection.findOneAndUpdate({email:req.body.identity},{$set:{password:hasdhedPassword}}).exec().then(()=>{
          res.status(res.statusCode).json({
            message: "password was updated",
            status: res.statusCode,
            typeError:"done",
            state:false
          });
        })
      }
    })
  }else{
    //telephone

  }

}
exports.updateEmailSendCode=(req,res)=>{
  if(req.body.email!=undefined && req.body.email.length>1){
    let randomNumber=Math.floor((Math.random() * 89999) + 10000)
    user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$set:{changeEmail:{ExpiresIn:Date.now(),newEmail:req.body.email,code:randomNumber}}}, { new: true }).exec().then(async result=>{
      if(result!=null){
        sendCode(randomNumber,"email",result.email,"")
        res.status(res.statusCode).json({
          message: "code raw teb3ath",
          status: res.statusCode,
          state:false
        });
      }else{
        res.status(res.statusCode).json({
          message: "user Not Found",
          status: res.statusCode,
          state:false
        });
      }
    })
  }else{
    res.status(res.statusCode).json({
      message: "user Not Found",
      status: res.statusCode,
      state:false
    });
  }
}
exports.updateEmail=(req,res)=>{
    user_collection.findOne({_id:req.verified.user_auth._id}).exec().then(async result=>{
      if(result.changeEmail.code!=req.body.code){
        res.status(res.statusCode).json({
          message: "Code raw 8alet",
          status: res.statusCode,
          typeError:"incorectCode",
          state:false
        });
      }else if(result.changeEmail.ExpiresIn+(60*60)<Date.now()){
        res.status(res.statusCode).json({
          message: "Code raw ofe wa9tou",
          typeError:"codeInvalid",
          status: res.statusCode,
          state:false
        });
      }else{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id,"changeEmail.newEmail":req.body.email},{$set:{email:req.body.email}}).exec().then((result)=>{
          if(result!=null){
            res.status(res.statusCode).json({
              message: "email was updated",
              status: res.statusCode,
              typeError:"done",
              state:false
            });
          }else{
            res.status(res.statusCode).json({
              message: "mahouch hedha il email li hatitou mi lowel",
              status: res.statusCode,
              state:false
            });
          }

        }).catch(error=>{
          res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          });
        })
      }
    })
}