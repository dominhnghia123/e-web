import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const userActive = cookieStore.get("userActive");

  const path = request.nextUrl.pathname;
  const checkPath =
    !path.includes("/buyer/signin") &&
    !path.includes("/buyer/signup") &&
    !path.includes("/seller/signin") &&
    !path.includes("/seller/signup");
  if (userActive?.value !== "1" && checkPath)
    return NextResponse.redirect(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*"],
};
