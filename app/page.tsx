'use client';

import React from 'react'
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import { ImageProvider } from "@/components/ImageContext";
import { useUser, SignIn, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <ImageProvider>
      <main className="container mx-auto px-4 py-8">
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
            <UserButton />
          </div>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Image</h2>
            <ImageUpload />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Saved Images</h2>
            <ImageGallery />
          </section>
        </SignedIn>
      </main>
    </ImageProvider>
  );
}
