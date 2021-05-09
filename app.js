const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const user_route = require('./api/routes/user_route')
/************************************************************/
const post_route=require('./api/routes/post_route')
const post_comments_route = require('./api/routes/post_comments_route')
/************************************************************/
const image_route=require('./api/routes/image_route')
const image_comments_route=require('./api/routes/image_comments_route')
const image_likes_route=require('./api/routes/image_likes_routes')
/************************************************************/
const follower_route=require('./api/routes/followers')
const following_route=require('./api/routes/following')
/************************************************************/
const refreshAccessToken_route = require('./api/routes/refreshAccessToken')
const post_like_route=require('./api/routes/post_likes')
const getnotifications_router=require('./api/routes/notification')
/******************************************************************/
const topic_router=require('./api/routes/dailyTopic')
/**************************************************/
const chat_router=require('./api/routes/chat')

const app = express()
const morgan = require('morgan')
const cors =require('cors')
mongoose.connect(
  'mongodb://localhost:27017/ahki',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  async (err, cl) => {

    if (err) {
      console.log('error de connection=' + err)
      throw err
    } else {
      console.log('connection')
    }
    mongoose.set('useFindAndModify', false)
 
    var whitelist = ['http://127.0.0.1:5010/','http://localhost:3000']
    var corsOptions = {
      credentials: true, 
      origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(null, true)
        }
      }
    }
    
    app.use(cors(corsOptions));

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(morgan('dev'))
    app.use('/uploads',express.static('./uploads'))
    app.use('/user', user_route)
    app.use('/token', refreshAccessToken_route)
    app.use('/postnrmltopic', post_route)
    app.use('/comments', post_comments_route)
    app.use('/postlike', post_like_route)
    app.use('/image', image_route)
    app.use('/imageComments', image_comments_route)
    app.use('/imageLikes', image_likes_route)
    app.use('/followers', follower_route)
    app.use('/following', following_route)
    app.use('/notification',getnotifications_router)
    app.use('/topic',topic_router)
    app.use('/chat',chat_router)
    /***************for sending pics in random chat*********************/

    app.use((req, res) => {
      res.status(404).json({ error: 'page not found' })
    })
  }
)
module.exports = app
