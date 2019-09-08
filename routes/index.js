const router = require('express').Router();
const path = require('path');

router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

router.route('/home')
  .get((req, res) => res.sendFile(path.join(`${__dirname}../../home.html`)));

module.exports = router;
