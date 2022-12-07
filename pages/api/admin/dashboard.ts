import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders:number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    //peor performance

   /*  const numberOfOrders = await Order.count();
    const paidOrders = await Order.find({isPaid: true}).count();
    const numberOfClients = await User.find({role:'client'}).count();
    const numberOfProducts = await Product.count();
    const productsWithNoInventory = await Product.find({inStock:0}).count();
    const lowInventory = await Product.find({inStock: {$lte:10}}).count(); // lte = less than equal (mongoose ) evalua que productos tienen menos de 10 items */

    //mejor performance nuclear las peticiones en un array de una sola promise

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts, 
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.count(),
        Order.find({isPaid: true}).count(),
        User.find({role:'client'}).count(),
        Product.count(),
        Product.find({inStock:0}).count(),
        Product.find({inStock: {$lte:10}}).count()
    ])

    res.status(200).json({
        numberOfOrders,
        paidOrders,        
        numberOfClients,
        numberOfProducts, 
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders,
    })

    await db.disconnect()
}