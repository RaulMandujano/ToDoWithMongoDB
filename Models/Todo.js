const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
	taskName: {
		type: String,
		unique: true,
	},
	completeStatus: Boolean,
	category: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Todo', TodoSchema);
