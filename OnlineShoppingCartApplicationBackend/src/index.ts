import express = require('express');
import config = require('config');
import cors = require('cors');
import connectMongo = require('connect-mongo');
import mongoose = require('mongoose');
import session = require('express-session');
import cookieParser = require('cookie-parser');
import bodyparser = require('body-parser');
import { PopulateDB } from './db/initialize/PopulateDB';
import { Routes } from './routes/api';

let app = express();

let defaultPort = config.get<string>('defaultPort');
let port = process.env.PORT;
if (!port) {
	port = defaultPort;
}

app.use(
	cors({
		origin: [
			'http://localhost:4200',
			'http://127.0.0.1:4200'
		],
		credentials: true
	})
);

let MongoStore = connectMongo(session);

mongoose.connect(`${config.get<string>('db.url')}`)

mongoose.set('runValidators', true);
mongoose.set('debug', true);

let db = mongoose.connection;

app.use(cookieParser())
app.use(
	session({
		cookie: {
			path: '/',
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 24 * 60 * 60
		},
		secret: 'test',
		proxy: true,
		store: new MongoStore({ mongooseConnection: db })
	})
);

app.use(bodyparser.json({ limit: '50mb' }));

db.on('error', () => {
	console.log('ODM failed to connect to the database... stopping');
});

db.on('open', function() {
	let server = app.listen(port, () => {
		console.log(`Listening on port ${port}`);
		PopulateDB.do()
			.then(res => {
				if (res) {
					console.log('Ran initializers successfully');
				} else {
					console.log('Failed to run initializers');
				}
			})
			.catch(err => {
				console.log(`Failed to run initializers, ${err}`);
            });
	});
});

app.use('/api', Routes);