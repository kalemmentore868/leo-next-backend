"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { db, storage } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Page() {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `categories/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const categoriesCollection = collection(db, 'Categories');
      await addDoc(categoriesCollection, {
        image_url: downloadURL,
        name,
        description,
        iconName,
      });

      // Reset form
      setImageUrl('');
      setName('');
      setDescription('');
      setIconName('');
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading category: ', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Category</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image URL
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            ref={fileInputRef}
          />
          {selectedImage && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md flex justify-center items-center">
              <Image src={imageUrl} alt="Selected" width={150} height={150} className="rounded-md" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter category name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter category description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="iconName">
            Icon Name
          </label>
          <input
            type="text"
            id="iconName"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter icon name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Upload Category
        </button>
      </form>
    </div>
  );
}
