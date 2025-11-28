import { createClient as createServerClient } from "@/supabase/server";
import { NextResponse } from "next/server";
import { getProfile, getRedirectUrlByRole } from "@/utils/profile";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  // If there's an error from OAuth provider
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    );
  }

  // Exchange code for session
  if (code) {
    const supabase = await createServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error("Exchange code error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    // Get user profile to determine redirect based on role
    const profile = await getProfile();
    const redirectUrl = profile
      ? getRedirectUrlByRole(profile.role)
      : "/dashboard"; // fallback

    return NextResponse.redirect(`${origin}${redirectUrl}`);
  }

  // No code and no error - redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
