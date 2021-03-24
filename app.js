const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const user_route = require('./api/routes/user_route')
const postNrmlTopic_controller_route=require('./api/routes/postNrmlTopic_controller_route')
const refreshAccessToken_route = require('./api/routes/refreshAccessToken')
const comments_controller_route = require('./api/routes/comments_route')
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
    app.use('/postnrmltopic', postNrmlTopic_controller_route)
    app.use('/comments', comments_controller_route)
    /***************for sending pics in random chat*********************/

    app.use((req, res) => {
      res.status(404).json({ error: 'page not found' })
    })
  }
)
module.exports = app
