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
const app = express()
const morgan = require('morgan')
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
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
      )
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
      }
      next()
    })

    app.use(bodyparser.urlencoded({ extended: true }))
    app.use(bodyparser.json())
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
    /***************for sending pics in random chat*********************/

    app.use((req, res) => {
      res.status(404).json({ error: 'page not found' })
    })
  }
)
module.exports = app
