"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";
import { SubmitHandler } from "react-hook-form";

type SignUpFormInputs = {
  email: string;
  password: string;
};

type SetupInputs = {
  fullName: string;
  bio: string | null;
  age: number;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  topic: string;
  writer: string;
  summary: string;
  image: string;
  is_editors_pick: boolean;
  date: string;
  description: string;
  comments: Comment[];
  created_at: string;
};

type formValues = {
  title: string;
  topic: string;
  summary: string;
  description: string;
  picture: File | null;
};

export type Comment = {
  name: string;
  time: string;
  profile: string;
  content: string;
};

export const login: SubmitHandler<SignUpFormInputs> = async ({
  email,
  password,
}) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const message = encodeURIComponent(error.message);
    redirect(`/auth/login?error=${message}`);
  }
  revalidatePath("/", "layout");
  redirect("/");
};

export const signup: SubmitHandler<SignUpFormInputs> = async ({
  email,
  password,
}) => {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) {
    const message = encodeURIComponent(error.message);
    redirect(`/auth/login?error=${message}`);
  } else if (!error) {
    revalidatePath("/", "layout");
    redirect(`/auth/signup?verify=true`);
  }
};

export const setupProfile = async (
  data: SetupInputs,
  profileImg: File | null
) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const message = encodeURIComponent(
      userError?.message ?? "User not authenticated"
    );
    redirect(`/auth/signup/setup?userError=${message}`);
  }

  let profileImgUrl: string | null = null;
  if (profileImg) {
    const fileExt = profileImg.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `Profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, profileImg);

    if (uploadError) {
      const message = encodeURIComponent(uploadError.message);
      redirect(`/auth/signup/setup?uploadError=${message}`);
    }

    const { data: publicURLData } = await supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);
    profileImgUrl = publicURLData.publicUrl;
  }

  const insertData = {
    id: user.id,
    age: typeof data.age === "number" ? data.age : null,
    full_name: data.fullName ?? "",
    bio: data.bio ?? null,
    email: user.email ?? "",
    profile_img: profileImgUrl ?? null,
  };

  const { error: insertError } = await supabase
    .from("authors")
    .insert(insertData);

  if (!insertError) {
    redirect("/");
  } else {
    const message = encodeURIComponent(
      insertError?.message ?? "Error inserting data!"
    );
    redirect(`/auth/signup/setup?insertError=${message}`);
  }
};

export const createPost = async ({
  description,
  summary,
  title,
  picture,
  topic,
}: formValues) => {
  const supabase = await createClient();
  const date = new Date();
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  let postImageURL: string | null = null;
  if (picture) {
    const fileExt = picture.name.split(".").pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filepath = `Posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filepath, picture);

    if (uploadError) {
      const message = encodeURIComponent(uploadError.message);
      redirect(`/auth/signup/setup?uploadError=${message}`);
    }

    const { data: publicUrlData } = await supabase.storage
      .from("posts")
      .getPublicUrl(filepath);
    postImageURL = publicUrlData.publicUrl;
  }

  const { data: authorData, error: authorError } = await supabase
    .from("authors")
    .select("*")
    .eq("id", user?.id);

  const { created_at, full_name, bio, email, profile_img, age } =
    authorData?.[0];
  const { error: dataSendError } = await supabase.from("posts").insert({
    author_id: user?.id,
    title: title,
    topic: topic,
    writer: full_name,
    summary: summary,
    image: postImageURL,
    date: formatted,
    description: description,
  });

  if (!dataSendError) {
    revalidatePath("/");
    redirect("/");
  } else {
    const message = encodeURIComponent(
      dataSendError?.message ?? "Error inserting data!"
    );
    redirect(`/auth/signup/setup?SendError=${message}`);
  }
};

export const removePost = async (postId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) {
    const message = encodeURIComponent(error.message ?? "Error Removing Post");
    redirect(`/posts/${postId}?deleteError=${message}`);
  } else {
    redirect(`/profile`);
  }
};

// export const handleGoogleSignIn = async () => {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: "http://localhost:3000/",
//     },
//   });
//   if (error) {
//     console.error("Error signing in:", error.message);
//   } else {
//     console.log("Redirecting to Google...", data);
//   }
//   console.log(data);
// };
