import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data = 
| { message: string }
| IUser[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUsers(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) =>  {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();
    // @ts-ignore
    return res.status(200).json( users );
}

const updateUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId ='', role='' } = req.body;

    if(!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Bad request user ID not valid' })
    }

    const validRoles = ['admin', 'client']

    if(!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Bad request role not valid' })
    }

    await db.connect();

    const user = await User.findById(userId);

    if(!user) {
        await db.disconnect()
        return res.status(404).json({ message: 'Bad request user not found' })
    }

    user.role = role;

    await user.save() //actualiza el usuario

    await db.disconnect()    
    
    return res.status(200).json({message: 'usuario actualizado' })
}

