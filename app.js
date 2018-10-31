var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, '.')));

app.get('/', function(req, res) {
    res.redirect('index.html');
});


app.listen(process.env.VCAP_APP_PORT || 3000, function() {
    console.log('Listening at 3000');
});