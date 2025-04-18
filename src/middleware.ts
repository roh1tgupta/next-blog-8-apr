import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /blogs and its subroutes
  // if (pathname.startsWith('/blogs/create')) {
    const sessionResponse = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });
    const session = await sessionResponse.json();
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_USER_NAME;

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      const signInUrl = new URL('/blogs/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blogs/create", "/chat/admin"],
};