import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = 
| { message: string }
| IProduct[]
| IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
        case 'POST':
            return createProduct(req, res)
        case 'PUT':
            return updateProducts(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' })
    }    
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const products = await Product.find()
        .sort({title:'asc'})
        .lean()

    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product;
    })

    return res.status(200).json(updatedProducts)
}

const updateProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id='', images=[]} = req.body as IProduct;

    if(!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del producto no es valido' })
    }

    if(images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })
    }

    //TODO localhost:3000/products/

    try {
        await db.connect()

        const product = await Product.findById(_id)

        if(!product) {
            await db.disconnect()
            return res.status(400).json({ message: 'No existe un producto con ese id' })
        }

        //https://res.cloudinary.com/boca1978/image/upload/v1658239149/vwjua29foudzr1qxjhzm.jpg
        product.images.forEach(async(image) => {
            if(!images.includes(image)){
                //borrar de cloudinary
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.') //obtener solo el id de la url last indexof elimina todo del string incluido el /
                await cloudinary.uploader.destroy(fileId)
            }
        })

        await product.update(req.body); //actualzamos el producto

        await db.disconnect()

        res.status(200).json(product)

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(400).json({ message: 'revisar la consola del servidor' })
    }
}

const  createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images=[]} = req.body as IProduct;

    if(images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })
    }

    try {
        await db.connect();

        const productInDB = await Product.findOne({slug: req.body.slug}) //validar si existe ese slug

        if(productInDB) {
            await db.disconnect()
            return res.status(400).json({ message: 'Ya existe este producto con ese slug' })
        }

        const product = new Product(req.body);    
        
        await product.save()        

        await db.disconnect()

        res.status(200).json(product)

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(400).json({ message: 'revisar la consola del servidor' })
    }
}

