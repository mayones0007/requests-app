import mongoose, { Schema } from 'mongoose';

export interface FieldModel {
  _id: string,
  name: string,
  code: string,
  description: string,
  type: string,
  required: boolean,
  options: string[],
  defaultValue: boolean | string,
}

export const fieldSchema = new Schema<FieldModel>({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  code: String,
  description: String,
  type: String,
  required: Boolean,
  options: Array,
  defaultValue: Schema.Types.Mixed,
});

export const Field = mongoose.model('Field', fieldSchema);