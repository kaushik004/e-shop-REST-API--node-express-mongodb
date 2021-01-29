const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
})

exports.User = mongoose.model('User', userSchema);