const path = require('path');

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const Todo = require('./Models/Todo');

const dotenv = require('dotenv');
const colors = require('colors');

// Load env variables

dotenv.config({ path: './config/config.env' });
const fs = require('fs');

// connecting with database

connectDB();

const app = express();

app.use(cors());

// serving static files
app.use(express.static('public'));
app.use(express.json());

app.post('/todos', async (req, res) => {
	console.log(req.body);
	try {
		const todo = await Todo.create(req.body);
		if (todo) {
			res.status(201).json({
				success: true,
				data: todo,
			});
		} else {
			res.status(400).json({
				success: false,
				data: {},
			});
		}
	} catch (err) {
		if (err.code === 11000) {
			res.status(400).json({
				success: false,
				error: `duplicate fieled value entered`,
			});
		}
	}
});

app.get('/todos', async (req, res) => {
	const todos = await Todo.find();
	if (todos) {
		res.status(200).json({
			success: true,
			count: todos.length,
			data: todos,
		});
	} else {
		res.status(404).json({
			success: false,
			data: {},
		});
	}
});

// Get Single Todo by it's id
app.get('/todos/:id', async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);
		if (todo) {
			res.status(200).json({
				success: true,
				data: todo,
			});
		} else {
			res.status(404).json({
				success: false,
				data: {},
			});
		}
	} catch (err) {
		if (err.name == 'CastError') {
			res.status(404).json({
				success: false,
				error: `Todo not found with id of ${req.params.id}`,
			});
		}
	}
});
app.put('/todos/:id', async (req, res) => {
	try {
		const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (todo) {
			res.status(200).json({
				success: true,
				data: todo,
			});
		} else {
			res.status(404).json({
				success: false,
				error: `Todo not found with id of ${req.params.id}`,
			});
		}
	} catch (err) {
		if (err.name == 'CastError') {
			res.status(404).json({
				success: false,
				error: `Todo not found with id of ${req.params.id}`,
			});
		}
	}
});
app.delete('/todos/:id', async (req, res) => {
	try {
		const result = await Todo.findByIdAndDelete(req.params.id);
		if (result) {
			res.status(200).json({
				success: true,
				data: [],
			});
		} else {
			res.status(400).json({
				success: false,
				error: `Todo not found with id of ${req.params.id}`,
			});
		}
	} catch (err) {
		if (err.name == 'CastError') {
			res.status(400).json({
				success: false,
				error: `Todo not found with id of ${req.params.id}`,
			});
		}
	}
});

// @delete all todos

app.delete('/todos', async (req, res) => {
	if (req.query['all'] == 'yes') {
		try {
			const result = await Todo.deleteMany();
			if (result) {
				res.status(200).json({
					success: true,
					data: [],
				});
			} else {
				res.status(400).json({
					success: false,
					data: [],
				});
			}
		} catch (err) {
			res.status(400).json({
				success: false,
				error: 'todos not deleted',
			});
		}
	} else {
		res.status(400).json({
			success: false,
			error: 'provide all = yes query string',
		});
	}
});

const server = app.listen(5000, () => {
	console.log('server is running');
});

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server and exit process

	server.close(() => process.exit(1));
});
