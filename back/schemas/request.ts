import mongoose, { Schema } from 'mongoose';

const requestSchema = new Schema({type: Schema.Types.Mixed}, { strict: false });
export const UserRequest = mongoose.model('UserRequest', requestSchema);