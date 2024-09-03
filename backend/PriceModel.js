const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
       
    value:{
        type:Number,
        required:true
    },
    time:{
        type:Date,
        default: Date.now 
    }
})

  const price = mongoose.model('price',priceSchema);

  module.exports = price;