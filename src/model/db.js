let mongoose = require('mongoose')
let dbPath = "mongodb://127.0.0.1/cellphoneDb"
require('./userModel');

mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', (err) => {
    console.log('database connect failed');
});

db.once('open', () => {
    console.log('database connect successfully!');
});

module.exports = mongoose;