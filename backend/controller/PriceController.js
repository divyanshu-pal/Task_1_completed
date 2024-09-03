const priceModel = require('../PriceModel');


const  getPrices = async(req,res)=>{
    try {
         const prices = await priceModel.find().sort({time:1});
         res.json(prices);
    } catch (error) {
        console.log(error,"error in fetching prices");
        res.status(500).json({message:'server error'})
    }
}


const addPrices = async(req,res)=>{
        
    const { value } = req.body;
    if (!value || isNaN(value)) {
        return res.status(400).json({ message: 'Invalid Price Value' });
    }
        try {
            const newPrice = new priceModel({ value });
        const savedPrice = await newPrice.save();
        res.status(201).json(savedPrice);

        } catch (error) {
            console.log('Error saving price',error);
            res.status(500).json({message:"Internal Server Error"});
        }
}

module.exports = {getPrices,addPrices};