import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {

    //middleware basado en session con next-auth

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // console.log({ session });

    const { origin } = req.nextUrl

    if (!session) {
        const requestedPage = req.page.name
        return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`)
    }

    const validRole = ['admin']

    if(!validRole.includes(session.user.role)) {
        return NextResponse.redirect(`${origin}/`)
    }

    return NextResponse.next();
}