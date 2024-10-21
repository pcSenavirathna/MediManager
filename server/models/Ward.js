const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
    wardNo: {
        type: String,
        unique: true
    },
    wardType: {
        type: String,
        required: true,
    },
    beds: [{
        bedNo: {
            type: String,
            unique: true
        },
        isOccupied: {
            type: Boolean,
            default: false
        },
        patientId: {
            type: String,
        },
    }]
});

module.exports = mongoose.model('Ward', WardSchema);
