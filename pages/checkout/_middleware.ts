import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {

    //middleware basado en session con next-auth

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // console.log({ session });

    const { origin } = req.nextUrl

    if (!session) {
        const requestedPage = req.page.name
        return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`)
    }

    return NextResponse.next();

    //middleware basado en cookies 

    // const { token = '' } = req.cookies;
    // // return new Response('No autorizado', {
    // //     status: 401
    // // });
    // try {
    //     await jwt.isValidToken( token );
    //     return NextResponse.next();
    // } catch (error) {
    //     // return Response.redirect('/auth/login');
    //     const requestedPage = req.page.name;
    //     return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
    // }

}