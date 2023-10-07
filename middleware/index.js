const applyHelmet = require('./helmet');
const applyBodyParser = require('./bodyParser');
const applyMorgan = require('./morgan');
const applyCors = require ('./cors')

module.exports = function(app) {
    applyCors(app);
    applyHelmet(app);
    applyBodyParser(app);
    applyMorgan(app);
}