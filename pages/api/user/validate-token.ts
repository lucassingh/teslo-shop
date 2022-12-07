import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { isValidToken, signToken } from '../../../utils/jwt'

type Data =
    | { message: string }
    | {
        token: string,
        user: {
            email: string,
            role: string,
            name: string
        }
    }

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return checkJWT(req, res)

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await isValidToken(token);
    } catch (error) {
        return res.status(401).json({
            message: 'unauthorized validation token'
        })
    }

    await db.connect();
    
    const user = await User.findById(userId).lean()

    await db.disconnect();

    if (!user) {
        return res.status(400).json({ message: 'User doesnt exists with this ID' })
    }

    const { _id, email, role, name } = user

    return res.status(200).json({
        token: signToken(_id, email),  //jwt
        user: {
            email, 
            role, 
            name
        }
    })
}

export default handler;
