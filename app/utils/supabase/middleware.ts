import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/profile")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: author, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", user.id)
      .single();
    const isProfileComplete =
      !author && !request.nextUrl.pathname.startsWith("/auth/signup/setup");

    if (isProfileComplete) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signup/setup";
      return NextResponse.redirect(url);
    }
  }

  // Optional: Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/auth/login") ||
      request.nextUrl.pathname.endsWith("/auth/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // or "/" for home
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
