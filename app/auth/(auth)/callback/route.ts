import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/auth/confirm";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.redirect(`${origin}/error`);
    }

    const user = data?.user;
    if (!user) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    // Check if user exists in 'authors' table
    const { data: existingAuthor, error: authorError } = await supabase
      .from("authors")
      .select("id")
      .eq("id", user.id)
      .single();

    if (authorError && authorError.code !== "PGRST116") {
      console.error("Error checking author:", authorError);
    }

    // If not exists, insert new record
    if (!existingAuthor) {
      const { error: insertError } = await supabase.from("authors").insert({
        id: user.id,
        full_name: user.user_metadata.full_name || user.email,
        email: user.email,
        profile_img: user.user_metadata.avatar_url,
        age: null,
      });

      if (insertError) {
        console.error("Error inserting author:", insertError);
      }
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  if (token_hash && type) {
    const supabase = await createClient();
    console.log(next);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirect(next);
    }
  }
  redirect("/error");
}
