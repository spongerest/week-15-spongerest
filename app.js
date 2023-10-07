const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const escapeHtml = require("escape-html");
const app = express();
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }))

const GlobalcorsOptions = {
    origin: ['https://crabby-bee-houndstooth.cyclic.app:7000', 'https://crabby-bee-houndstooth.cyclic.app:8000', 'http://localhost:5555'],
}

const allowAllOptions = {
    origin: "*",
}

app.use(express.json());
const ClientXoptions = {
    origin: 'https://crabby-bee-houndstooth.cyclic.app:7000',
    methods: ['GET', 'POST'],
}

const ClientYoptions = {
    origin: 'https://crabby-bee-houndstooth.cyclic.app:8000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}

const requestIdMiddleware = (req, res, next) => {
    if (req.headers['x-request-id']) {
        res.setHeader("x-request-id", req.headers['x-request-id'])
        req.request_id = req.headers['x-request-id']
    } else {
        const uuid = uuidv4()
        res.setHeader("x-request-id", uuid)
        req.request_id = uuid
    }
    next()
}

const logggerMiddleware = (req, res, next) => {
    console.log(req.request_id)
    next()
}
app.get('/sensitive-data', (req, res) => {
    let query = "SELECT * FROM users WHERE username = " + req.query.username;
    res.send(query);
});

app.get('/click-jacking', (req, res) => {
    res.send(`
        <form action="/click-jacking" method="post">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username"><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password"><br>
            <input type="submit" value="Submit">
        </form>
        `);
    });
app.post('/click-jacking', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.json({ username: username, password: password });
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/request', requestIdMiddleware, (req, res) => {
    console.log(req.headers)
    res.send('Hello World!');
});
app.get("/xss", (req, res) => {
    const name = escapeHtml(req.query.name);
    res.send(`<h1>Hello, ${name}</h1>`);
});

app.get('/sample-header', (req, res) => {
    if (req.header('Accept').includes('text/html')) {
        res.setHeader('Content-Type', 'text/html');
        res.send('<h1 style="color: red;">Hello World!</h1>');
    } else if (req.header('Accept').includes('application/json')) {
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: 'Hello World!' });
    } else {
        res.send('Hello World!');
    }
});



app.get('/cors', (req, res) => {
    res.json({ message: 'This is a CORS-Enabled Route Global' });
});


app.get('/client-x', cors(ClientXoptions), (req, res) => {
    res.json({ message: 'This is a CORS-Enabled X-Client GET Route' });
});

app.options('/client-x', cors(), (req, res) => {});

app.post('/client-x', cors(ClientXoptions), (req, res) => {
    let body = req.body;
    res.json({ message: body });
})


app.get('/client-y', cors(ClientYoptions), (req, res) => {
    res.json({ message: 'This is a CORS-Enabled Y-Client GET Route' });
});
app.post('/client-y', cors(ClientYoptions), (req, res) => {
    res.json({ message: 'This is a CORS-Enabled Y-Client POST Route' });
})
app.delete('/client-y', cors(ClientYoptions), (req, res) => {
    res.json({ message: 'This is a CORS-Enabled Y-Client DELETE Route' });
})
app.put('/client-y', cors(ClientYoptions), (req, res) => {
    res.json({ message: 'This is a CORS-Enabled Y-Client PUT Route' });
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
