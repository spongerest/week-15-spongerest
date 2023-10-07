const cors = require('cors')

module.exports = (app) => {
    app.use(cors(
        {
            origin : ['http://localhost:5000', 'http://localhost:6000'],
        }
    ))
}