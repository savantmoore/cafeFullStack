const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db
//database and server in only 7 lines thanks to express!
MongoClient.connect('mongodb://cafe:coffee@ds161099.mlab.com:61099/coffee-shop', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public')) //serve up all files under public, instead of having to include unique endpoints for each file

//server and db are set up, everything below is the api
app.get('/', (req, res) => {
  db.collection('orders').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {orders: result})
  })
})

app.post('/orders', (req, res) => {
  db.collection('orders').save({name: req.body.name, order: req.body.order, size: req.body.size, cream: req.body.cream, milk: req.body.milk, sugar: req.body.sugar, thumbUp: ""}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/orders', (req, res) => {
  db.collection('orders')
  .findOneAndUpdate({name: req.body.name},{name: req.body.name + " Order READY"}, {
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    // res.redirect('/')
    res.send(result)
  })
})
// app.put('/thumbDown', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbDown:req.body.thumbDown + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.delete('/orders', (req, res) => {
  db.collection('orders').findOneAndDelete({name: req.body.name}, {name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
