#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debugLib from 'debug';
import { createServer } from 'http';

import mongoose from 'mongoose'

const debug = debugLib('smoothtravel-backend:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

 const MONGO_USER = process.env.MONGO_USER;
 const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
 const MONGO_DB = process.env.MONGO_DB;

 const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@learning-mongo-db.6hggv.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

// connect to mongo database
 mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		server.listen(port);
		server.on('listening', onListening);
	})
	.catch((err) => {
		console.log(err);
		onError;
	});

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
