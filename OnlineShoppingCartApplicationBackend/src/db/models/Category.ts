import { Schema, SchemaTypes, model } from 'mongoose'

const ObjectId = SchemaTypes.ObjectId

let CategorySchema = new Schema({
    name: String,
    deliveryCharges: Number
})

let Category = model('category', CategorySchema)


export { Category }