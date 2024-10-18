"use client";

import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { motion } from 'framer-motion'
import { useImageContext } from './ImageContext'
import { useUser } from "@clerk/nextjs";

export default function ImageUpload() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { triggerRefresh } = useImageContext()
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !user) return

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('kept')
        .upload(fileName, file)

      if (error) throw error

      console.log('File uploaded successfully:', data)

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kept/${data.path}`
      console.log('Public URL:', publicUrl)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          image_url: publicUrl,
          user_id: user.id // Include the user ID from Clerk
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload image info');
      }

      const result = await response.json();
      console.log('Image info inserted successfully:', result)
      
      // Clear form
      setName('')
      setFile(null)
      ;(document.getElementById('file-input') as HTMLInputElement).value = ''

      alert('Image uploaded successfully!')
      triggerRefresh() // Make sure this function is called after a successful upload
    } catch (error) {
      console.error('Error:', error)
      alert('Error uploading image: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Image Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
            Choose Image
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <motion.button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </motion.button>
      </form>
    </div>
  )
}
