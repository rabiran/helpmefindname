 
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    status: {
        step: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            required: true
        }
    }
});

// makes the final object on view prettier with just id field and not _id.
schema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

module.exports = mongoose.model(`immigrants`, schema);