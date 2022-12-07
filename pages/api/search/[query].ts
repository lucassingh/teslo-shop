import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data =
    | { message: string }
    | IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res)

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    let { query= '' } = req.query; //extraigo query por que asi llame al archivo

    if (query.length === 0 ) {
        return res.status(400).json({ message: 'You must put a query search' })
    }

    query = query.toString().toLocaleLowerCase()

    await db.connect()

    const productsByQuery = await Product.find({
        $text: {$search: query} //ver indice creado en el modelo
    }).lean();

    await db.disconnect();

    return res.status(200).json(productsByQuery)
}
