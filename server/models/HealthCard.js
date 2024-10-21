const mongoose = require('mongoose');

const healthCardSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	nicNo: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	bloodGroup: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	qrKey: {
		type: String,
		required: false
	}
}, { timestamps: true });

module.exports = mongoose.model('HealthCard', healthCardSchema);
