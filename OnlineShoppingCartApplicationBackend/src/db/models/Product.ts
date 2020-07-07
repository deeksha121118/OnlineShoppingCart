import { Schema, SchemaTypes, model } from 'mongoose'

const ObjectId = SchemaTypes.ObjectId

let ProductSchema = new Schema({
    name: String,
    category: {type: ObjectId, ref: 'category'},
    cost: Number,
    discount: Number, // Normal Discount
    addIDdiscount: Number // Additional Independence Day Discount
})

let Product = model('product', ProductSchema)

export { Product }