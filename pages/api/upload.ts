import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, image_url } = req.body;

  if (!name || !image_url) {
    return res.status(400).json({ error: 'Name and image_url are required' });
  }

  console.log("Inserting image with user_id:", userId);

  const { data, error } = await supabase
    .from("images")
    .insert({ name, image_url, user_id: userId })
    .select();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
