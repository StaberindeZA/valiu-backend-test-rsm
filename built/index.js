require('dotenv').config({ path: '.env' });
var app = require('./app');
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    console.log("Express running on PORT " + server.address().port);
});
