"use client";

import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs"
import { useImageContext } from './ImageContext'

interface Image {
  id: string
  name: string
  image_url: string
}

export default function ImageGallery() {
  const [images, setImages] = useState<Image[]>([])
  const { isSignedIn, user } = useUser()
  const { refreshTrigger } = useImageContext()

  useEffect(() => {
    if (isSignedIn) {
      fetchImages()
    }
  }, [isSignedIn, refreshTrigger])  // Add refreshTrigger to the dependency array

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        console.error('Failed to fetch images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">{image.name}</h3>
          <img src={image.image_url} alt={image.name} className="w-full h-auto max-h-64 object-cover rounded" />
        </div>
      ))}
    </div>
  )
}
