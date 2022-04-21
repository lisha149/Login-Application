const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
//register
router.get('/register', forwardAuthenticated, (req,res)=>{
    res.render('register');
});
//login
router.get('/login', forwardAuthenticated, (req,res)=>{
    res.render('login');
});

// Register
router.post('/register', (req, res) => {
    // console.log(req.body)
    //  res.send("Hello");
    const { name, email, password, password2 } = req.body;
    let errors=[];
    // //validate
    // //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
       }
    // //check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
         }
    // //check pw length
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
       }

       if (errors.length > 0) {
         res.render('register', {
           errors,
           name,
           email,
           password,
           password2
         });
       } else {
           User.findOne({email:email})
           .then(user=>{
               if(user){
                   errors.push({msg:"Email is already registered"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
               }
               else{
                const newUser = new User({
                    name,
                    email,
                    password
           });
           //hash pw
           bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
        })
        //    console.log(newUser)
        //    res.send('hello')

           }
          });
        }
      })
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports=router;