var express = require('express');
var router = express.Router();

/* GET main receiver page. */
router.get('/', function(req, res) {

  res.render('receiver/index', { title: 'Express' });

});

module.exports = router;
