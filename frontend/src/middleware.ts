import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/consts";

export const config = {
  matcher: [
    // 以下のパスを除く
    // - api
    // - _next/static
    // - _next/image
    // - favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/reset") {
    // cookie を削除してトップページにリダイレクト(トップページで再作成する)
    const response = NextResponse.redirect(new URL("/", request.url));
    if (request.cookies.has("user_token")) {
      response.cookies.delete("user_token");
    }
    if (request.cookies.has("locale")) {
      response.cookies.delete("locale");
    }
    return response;
  }

  // locale の変更
  if (Object.keys(locales).includes(request.nextUrl.pathname.slice(1))) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("locale", request.nextUrl.pathname.slice(1));
    return response;
  }

  if (!request.cookies.has("user_token") || !request.cookies.has("locale")) {
    // ユーザー識別用の token が cookie に保存されていない場合
    // もしくは、locale が cookie に保存されていない場合
    // トップページにリダイレクトし、新規作成する
    if (request.nextUrl.pathname === "/") {
      // トップページの場合
      const response = NextResponse.next();
      if (!request.cookies.has("user_token")) {
        // token を新規作成
        const res = await fetch("http://backend:8000/user", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        // cookie に保存
        response.cookies.set("user_token", data.user_token);
      }
      if (!request.cookies.has("locale")) {
        response.cookies.set("locale", defaultLocale);
      }
      return response;
    } else {
      // トップページ以外の場合
      // トップページにリダイレクト
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
