import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
});

userSchema.pre('save', function (next) {
    this.updatedAt = new Date();   
    return next();
});

userSchema.pre('update', function (next) {
    this.updatedAt = new Date();   
    return next();
});

userSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.password);
}
userSchema.methods.setRefreshToken = function(refreshToken: string) {
    this.refreshToken = refreshToken;
    return this.save()
}
export const UserSchema = userSchema;
