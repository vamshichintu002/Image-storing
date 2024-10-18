import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const s3Client = new S3Client({
  forcePathStyle: true,
  region: 'ap-south-1', // Replace with your actual region
  endpoint: process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/s3',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY || '',
  }
});

export async function getSignedImageUrl(objectKey: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: 'images', // Replace with your actual bucket name
    Key: objectKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}
