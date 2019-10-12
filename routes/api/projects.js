const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.user);
  res.send({ result: req.user });
});

module.exports = router;
