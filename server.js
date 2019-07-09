var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

app = express();

app.use(express.static('dist'));

app.get('*', (req, res) => {
    if(req.protocol === 'https') {
        res.redirect('http://' + req.headers.host + req.url);
    }

    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);