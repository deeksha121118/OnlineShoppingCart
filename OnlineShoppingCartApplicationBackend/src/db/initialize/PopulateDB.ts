import { Category } from '../models/Category'
import * as fs from 'fs'
import * as path from 'path'
import { Product } from '../models/Product'

class PopulateDB {
  static do(): Promise<boolean>{
    let categorydata = fs.readFileSync(path.join(__dirname, '../data/Category.json'), 'utf8')
    let productdata = fs.readFileSync(path.join(__dirname, '../data/Product.json'), 'utf8')
    let p = new Promise<boolean>((resolve, reject) => {
        let categories = new Map()
        let data: any;
        Category.findOne({}, (err, result) => {
            if(err) {
                reject(err)
            } else {
                if(!result) {
                    Category.insertMany(JSON.parse(categorydata), (err, docs) => {
                        if(err) {
                            console.log(`Failed to populate the db, ${err}`)
                            resolve(false)
                        } else {
                            data = docs
                            data.map((d: { get: (arg0: string) => any; _id: any }) => {
                                categories.set(d.get('name'), d._id)
                            })
                            Product.findOne({}, (err, result) => {
                                if(err) {
                                    reject(err)
                                } else {
                                    if(!result) {
                                        let parsedData = JSON.parse(productdata)
                                        parsedData.map((pd: any, i: any) => {
                                            pd.category = categories.get(pd.category)
                                        })
                                        Product.insertMany(parsedData, (err, docs) => {
                                            if(err) {
                                                console.log(`Failed to populate the db, ${err}`)
                                                resolve(false)
                                            } else {
                                                console.log('Populated the database.')
                                                resolve(true)
                                            }
                                        })
                                    } else {
                                        console.log('No need to populate the database... Already done.')
                                        resolve(true)
                                    }
                                }
                            }) 
                        }
                    })
                } else {
                    console.log('No need to populate the database... Already done.')
                    resolve(true)
                }
            }
        })      
    })
    return p
  }
}

export { PopulateDB }