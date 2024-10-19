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
  const [selectedImage, setSelectedImage] = useState<Image | null>(null) // State for the selected image
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

  const handleImageClick = (image: Image) => { // Function to handle image click
    setSelectedImage(image)
  }

  const closeModal = () => { // Function to close the modal
    setSelectedImage(null)
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg p-4" onClick={() => handleImageClick(image)}> {/* Add onClick event */}
          <h3 className="text-lg font-medium mb-2">{image.name}</h3>
          <img src={image.image_url} alt={image.name} className="w-full h-auto max-h-64 object-cover rounded" />
        </div>
      ))}
      {selectedImage && ( // Render modal if an image is selected
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
          <img src={selectedImage.image_url} alt={selectedImage.name} className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()} /> {/* Prevent closing when clicking on the image */}
          <button className="absolute top-4 right-4 text-white" onClick={closeModal}>Close</button> {/* Close button */}
        </div>
      )}
    </div>
  )
}
