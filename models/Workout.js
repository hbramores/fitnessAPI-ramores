const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workout name is Required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is Required'],
        min: [1, 'Duration must be at least 1 minute']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Workout', workoutSchema);
