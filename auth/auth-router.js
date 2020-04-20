const router = require("express").Router();
const bcrypt = require('bcryptjs');

const Users = require("../users/user-model.js");

router.post("/register", (req, res) => {

    const newUser = req.body;
  
    const hashedPassword = bcrypt.hashSync(newUser.password, 14);
  
    newUser.password = hashedPassword;
  
    Users.add(newUser)
      .then(saved => {
        res.status(200).json(saved);
      })
      .catch(err => {
          console.log(err)
          res.send(err)
      });
});

router.post("/login", (req, res) => {

  const {username, password} = req.body;

  Users.findBy({username})
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)){
        req.session.loggedIn = true;
        res.status(200).json({message: 'Welcome'});
      } else {
        res.status(401).json({message: 'username or password is not correct'});
      }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'no'})
    });
});

module.exports = router;
