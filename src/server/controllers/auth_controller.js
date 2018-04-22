export default {
  // signup(req, res, next) {
  //   const { email, name, password } = req.body;
  //
  //   if (!email || !name || !password) {
  //     return res.status(422).send({ error: 'You must provide email, name, and password' });
  //   }
  //
  //   // See if a user with the given email exists
  //   User.findOne({ email })
  //     .then(existUser => {
  //       // If a user with email dost exist, return an error
  //       if (existUser) {
  //         return res.status(422).send({ error: 'Email is in use' });
  //       }
  //
  //       // If a user with email dost Not exist, create and save user record
  //       const user = new User({ email, name, password });
  //       user.save()
  //       // Respond to request indicating the user was created
  //         .then(user => res.send(user))
  //         .catch(next);
  //     })
  //     .catch(next);
  // },

  login(req, res, next) {
    const { _id, username, online } = req.user;

    res.send({ _id, username, online });
  },

  logout(req, res, next) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send({ error: 'Logout error' });
      }

      res.clearCookie('connect.sid');
      res.sendStatus(200);
    });
  },

  auth(req, res, next) {
    res.send('Authenticated ' + req.user.id);
  }
};