const user_collection = require("../models/user");
const image_collection = require("../models/image");
const refreshAccessToken_collection = require('../models/refreshAccessToken') 
const followers_collection =require('../models/followers')

const bcrypt = require("bcrypt");
const ENV = require("dotenv");
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
var handlebars = require('handlebars');
const fs = require("fs");
var nodemailer = require('nodemailer');
ENV.config();

exports.register = async (req, res) => {
  var today = new Date()

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
          verified:true,
          privacy:"private",
          joindate:today
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
        verified:true,
        privacy:"private",
        joindate:today
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
          }).catch(error=>{
            res.status(res.statusCode).json({
              message: error.message,
              status: res.statusCode
          })          
        });
        }
      
  } catch (err) {
    res.status(res.statusCode).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  if(req.body.identity==undefined  || req.body.password==undefined){
    res.status(res.statusCode).json({
      message: "user not found",
      status: res.statusCode,
      state: false,
    });
  }else{
    const userdata = await user_collection.findOne({$or:[{ tel: req.body.identity} ,{email:req.body.identity}]}).select().exec();
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
       await jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '86400s' },
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

exports.getUserData=(req,res)=>{
 
 
  try{

    user_collection.aggregate([{$match:{ _id: Mongoose.Types.ObjectId(req.verified.user_auth._id) }},
      {$project: {currentImageUrl:1,tel:1,biography : 1,userName:1,firstname:1,currentImgId:1,lastname:1,age:1}}
    ]).exec().then(result=>{
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
          user_collection.aggregate([{$match:{ _id: Mongoose.Types.ObjectId(req.params.id)}},{$limit: 1},{$project: {privacy:1, currentImgId:1,privacy:1,currentImageUrl:1,biography : 1,userName:1,firstname:1,lastname:1}}]).exec().then(result=>{

            if(result.length!=0){

              if(result[0].privacy=="private"){
                if(req.verified==undefined){
                  res.status(res.statusCode).json({
                    data: {},
                    state:false,
                    status: res.statusCode,
                  });
                }else{
                  followers_collection.findOne({userid:req.params.id,followersid:req.verified.user_auth._id}).exec().then(resultFollower=>{
                    if(resultFollower!=null && resultFollower!=undefined){
                      res.status(res.statusCode).json({
                        private:"public",
                        data: result,
                        status: res.statusCode,
                      });
                    }else{
                      res.status(res.statusCode).json({
                        private:"private",
                        data: result,
                        status: res.statusCode,
                      });
                    }
                  }).catch(error=>{
                    res.status(res.statusCode).json({
                      private:"private",
                      data: result,
                      status: res.statusCode,
                    });
                  })
                }
  

              }else{
                res.status(res.statusCode).json({
                  private:"public",
                  data: result,
                  status: res.statusCode,
                });
              }
            }else{
                res.status(res.statusCode).json({
                  data: {},
                  state:false,
                  status: res.statusCode,
                });
            }
          })
        }catch(e){
          res.status(res.statusCode).json({
            message: e.message,
            status: res.statusCode,
          });
        }
  
    

}

exports.changeprofileimage=async (req,res)=>{
  var today = new Date()
  var Image
  Image = new image_collection({
    _id: new Mongoose.Types.ObjectId(),
    imageUrl:process.env.ip+req.file.path,
    ImageOwner:req.verified.user_auth._id,
    imageText:req.body.bio,
    date:today,
    likes:[],
    
    Comments:[],
  });

  Image.save().then(async (result) =>{

    let data = await user_collection.findOneAndUpdate({ _id: req.verified.user_auth._id}, {$set:{currentImgId:Image._id,currentImageUrl:process.env.ip+req.file.path},$push: {userProfileImagesUrl:Image._id} }, { new: true }).select('_id currentImageUrl').exec().then((result)=>{
      res.status(res.statusCode).json({
        Picurl: process.env.ip+req.file.path,
        status: res.statusCode,
      });
    }).catch(e=>{

      res.status(res.statusCode).json({
        message: e.statusCode,
      });
    })
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.statusCode,
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
      await jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '86400s' },
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
    user_collection.findOne({$or:[ {email:telOrEmail},{tel:telOrEmail}]}).select("userName currentImageUrl email tel").exec().then(result=>{
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






exports.getrandomUsers=(req,res)=>{
  let oldUsers=[...req.body.oldUsers,req.verified.user_auth._id]

  user_collection.aggregate([{ $sample: { size: 6 } },{$project: { userName:1,currentImageUrl:1}} ]).exec().then(result=>{
    const newArrayOfRandomUsers=result

    for(let i=0;i<oldUsers.length;i++){
      for(let j=0;j<result.length;j++){
          if(result[j]._id==oldUsers[i]){
            newArrayOfRandomUsers.splice(j,1)
        }
      }
    }
  res.status(res.statusCode).json({
    data:newArrayOfRandomUsers,
    message: "random users ",
    status: res.statusCode,
    state:true
  });
 }).catch(error=>{
  res.status(res.statusCode).json({
    message: error.message,
    status: res.statusCode,
    state:false
  });
 })
}
exports.SearchUserByUserName=(req,res)=>{
  let searchData=req.body.searchUserName
  if(req.body.searchUserName.length>0){
    //$nin
    user_collection.find({ userName: { $regex: `.*${searchData}.*`},_id:{$ne:req.verified.user_auth._id}}).select('userName currentImageUrl').exec().then(async result=>{
      res.status(res.statusCode).json({
        data:result,
        message: "search users ",
        status: res.statusCode,
        state:true
      });
    }).catch(error=>{
      res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      });
    })
  }else{
    res.status(res.statusCode).json({
      message: "ekteb haja",
      status: res.statusCode,
      state:false
    });
  }

}



exports.getPrivacy=(req,res)=>{
  user_collection.findOne({_id: Mongoose.Types.ObjectId(req.verified.user_auth._id)}).select("privacy").exec().then(result=>{
    res.status(res.statusCode).json({
      data:result,
      state:true
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
  })

}
exports.updatePrivacy=(req,res)=>{
  user_collection.findOneAndUpdate({_id: Mongoose.Types.ObjectId(req.verified.user_auth._id)},{$set:{privacy:req.body.privacy}}).select("privacy").exec().then(result=>{
    
    res.status(res.statusCode).json({
      data:result,
      message: "images",
      state:true
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
  })
}