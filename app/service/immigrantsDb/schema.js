 
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    primaryDomainUser: {
        type: String,
        required: true
    },
    status: {
        progress: {
            type: String,
            required: true
        },
        step: {
            type: String,
            required: true
        },
        subStep: {
            type: String,
            required: false
        },
    },
    shadowUsers: [{
        domainUser: {
            type: String,
            required: true
        },
        fields: {
            type: Object,
            required: true
        },
        required: false
    }]
});

// makes the final object on view prettier with just id field and not _id.
schema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if(ret.shadowUsers)
            for(user of ret.shadowUsers) {
                delete user._id;
            }
    }
}); 

module.exports = mongoose.model(`immigrants`, schema);