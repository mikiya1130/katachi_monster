import { NextResponse, type NextRequest } from "next/server";

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
  if (!request.cookies.has("user_token")) {
    // ユーザー識別用の token が cookie に保存されていない場合
    if (request.nextUrl.pathname === "/") {
      // トップページの場合
      // token を新規作成
      const res = await fetch("http://backend:8000/user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      // cookie に保存
      const response = NextResponse.next();
      response.cookies.set("user_token", data.user_token);
      return response;
    } else {
      // トップページ以外の場合
      // トップページにリダイレクト
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
