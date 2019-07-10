import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
    id: mongoose.Types.ObjectId,
    username: string,
    password: string,
    updatedAt: Date,
    createdAt: Date,
    refreshToken: string,
    comparePassword(password: string): Promise<boolean>;
    setRefreshToken(refreshToken: string),
}
