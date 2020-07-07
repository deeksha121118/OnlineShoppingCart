import express = require('express');
import { Product } from '../db/models/Product';

const router = express.Router();

interface ParamObject {
    [key: string]: any
}

router.get('/get-products-list', (req, res) => {
    var criteria: ParamObject = {}
    if (req.query.search !== undefined) {
        criteria.name = { $regex: new RegExp('.*' + req.query.search + '.*', 'i') };
    }
    Product.find(criteria, {}).populate('category').then((result) => {
        if(result)
            res.status(200).json(result)
    }).catch(err => {
        res.status(400).json(err)
    })
})

export const Routes = router;