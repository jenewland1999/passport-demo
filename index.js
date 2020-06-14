const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local')
// const passportLocalMongoose = require('passport-local-mongoose')

// DB Models
const User = require('./models/user')

// Connect to DB
mongoose.connect('mongodb://localhost/auth_demo_app')

// Initialize the app
const app = express()

// Set the view engine to ejs
app.set('view engine', 'ejs')

// Initialize the session middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('express-session')({
  secret: 'hoidgrxhgoridxurhxoigdxihrgdogrx8hox4g8gi84dyh9e9oth8li9e8iht4i84th8git',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

/**
 * ==============
 * EXPRESS ROUTES
 * ==============
 *
 * Here are all the defined routes of my application.
 */

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret')
})

/**
 * ===========
 * AUTH ROUTES
 * ===========
 */
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.error(`Something went wrong. ${err}`)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/secret')
    })
  })
})

/**
 * ============
 * LOGIN ROUTES
 * ============
 */
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}), (req, res) => {

})

/**
 * =============
 * LOGOUT ROUTES
 * =============
 */

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

/**
 * ==========
 * Middleware
 * ==========
 */
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// Run local server on port 3000
app.listen(3000, () => {
  console.log('Started Server')
})
