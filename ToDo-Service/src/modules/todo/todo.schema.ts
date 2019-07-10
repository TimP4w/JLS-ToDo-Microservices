import * as mongoose from 'mongoose';

let todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: Boolean
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }, 
    owner: String,
});

todoSchema.pre('save', function (next) {
    this.updatedAt = new Date();   
    return next();
});

todoSchema.pre('update', function (next) {
    this.updatedAt = new Date();   
    return next();
});


export const TodoSchema = todoSchema;
