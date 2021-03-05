const user_collection = require("../models/user");
const refreshAccessToken_collection = require('../models/refreshAccessToken') 
const bcrypt = require("bcrypt");
const ENV = require("dotenv");
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");
const fs = require("fs");

ENV.config();
exports.register = async (req, res) => {
  try {
    const saltRounds = await bcrypt.genSalt(10);
    const hasdhedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const password = hasdhedPassword;
    const userName = req.body.userName;
    const tel = req.body.tel.slice(req.body.dialCode.length,req.body.tel.length);
    const dialCode = req.body.dialCode
    const age=req.body.day+"/"+req.body.month+"/"+req.body.year
    const user_data = await user_collection.findOne({tel: tel}).exec();
    if (user_data != null) {
      res.status(res.statusCode).json({
        message: "user alredy exist",
        status: res.statusCode,
        state:false
      });
    } else {
      const User = new user_collection({
        _id: new Mongoose.Types.ObjectId(),
        biography:"Taking chances almost always makes for happy endings.",
        userName,
        password,
        dialCode,
        tel,
        age
      });

      var error = User.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: "invalid user",
          status: res.statusCode,
          state:false
        });
      }
      User.save().then((result) => {
        res.status(res.statusCode).json({
          message: "user has been created",
          result,
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
exports.loginFacebook = async (req, res) => {

  const userdata = await user_collection.findOne({idfacebook:req.body.id}).exec();
  if(userdata){
    const user_data = {
      _id: userdata._id,
  };
     jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '10s' },
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

  }else{
    const idfacebook=req.body.id;
    const userProfileImageUrl=req.body.urlImage
    const User = new user_collection({
      _id: new Mongoose.Types.ObjectId(),
      biography:"Taking chances almost always makes for happy endings.",
      idfacebook,
      userProfileImageUrl,
    });
    User.save().then( () => {
      const newUserInfo= {
        _id: User._id,
    };
       jwt.sign({ user_auth: newUserInfo },process.env.secret_key_token,{ expiresIn: '10s' },
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
           const refreshAccessToken= new refreshAccessToken_collection({
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
exports.login = async (req, res) => {
  const userdata = await user_collection.findOne({ tel: req.body.tel }).exec();
  if (userdata != null) {
    if (await bcrypt.compare(req.body.password, userdata.password)) {
      const user_data = {
          tel: req.body.tel,
          _id: userdata._id,
      };
       await jwt.sign({ user_auth: user_data },process.env.secret_key_token,{ expiresIn: '10s' },
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
  const tel = req.body.tel;
  const dialCode = req.body.dialCode;
  const email = req.body.email;
  const age = req.body.age;
  const biography= req.body.tel
  let params = {
    userName,
    firstname,
    lastname,
    tel,
    dialCode,
    email,
    biography,
    age,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  user_collection.findOneAndUpdate({ _id: req.verified.user_auth._id}, { $set: params }, { new: true }).select('userName firstname lastname tel dialCode email biography age')
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
        state: false,
      });
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
    user_collection.aggregate([{$match:{ _id: Mongoose.Types.ObjectId(req.verified.user_auth._id) }},{$project: { userProfileImageUrl:1,biography : 1,userName:1,firstname:1,lastname:1,following: { $size:"$following" },followers: { $size:"$followers" }}}]).exec().then(result=>{
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
