"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase"; // assumes storage export
import { CategoryService } from "@/src/data/services/CategoryService";
import { getToken } from "@/src/data/services/util";
import { Category } from "@/src/types/Category";

/* ------------------------------------------------ constants */
const FILE_TYPES = "image/*";

/** --------------------- page component ------------------------------ */
const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  // form state
  const [form, setForm] = useState({ name: "", order: 0, image_url: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ fetch ---------------------------------------- */
  const fetchCats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");
      const cats = await CategoryService.getAllCategories(token);
      setCategories(cats);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  /* ------------------ open modal ----------------------------------- */
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, order: cat.order, image_url: cat.image_url });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  /* ------------------ handlers ------------------------------------- */
  const handleChange = (k: keyof typeof form, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ------------------ submit edit ---------------------------------- */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const token = await getToken();
      if (!token) return;

      let finalImageUrl = form.image_url;

      // if a new file is chosen, upload first
      if (selectedFile) {
        const path = `categories/${editing.category_id}-${Date.now()}`;
        const ref = storageRef(storage, path);
        await uploadBytes(ref, selectedFile);
        finalImageUrl = await getDownloadURL(ref);
      }

      await CategoryService.updateCategory(token, editing.category_id, {
        name: form.name.trim(),
        order: Number(form.order),
        image_url: finalImageUrl,
      });
      setShowModal(false);
      await fetchCats();
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  /* ------------------ ui ------------------------------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">Categories</h1>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded text-sm">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Order</th>
                <th className="p-2">Image</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr
                  key={c.category_id}
                  className={i % 2 ? "bg-gray-50" : "bg-gray-100"}
                >
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.order}</td>
                  <td className="p-2">
                    <img
                      src={c.image_url}
                      alt=""
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <a
                      href={`/list/subcategories/${c.category_id}`}
                      className="px-2 py-1 text-xs bg-gray-700 text-white rounded"
                    >
                      Subcategories
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4 text-sm">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">Category Name</label>
                <input
                  className="border px-3 py-2 rounded"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="Name"
                />
              </div>

              {/* Order */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">Order</label>
                <input
                  type="number"
                  className="border px-3 py-2 rounded"
                  value={form.order}
                  onChange={(e) => handleChange("order", e.target.value)}
                  required
                  placeholder="Order"
                />
              </div>

              {/* Image */}
              <div className="flex flex-col gap-2">
                <label className="font-medium flex items-center gap-3">
                  Image
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Change Image
                  </button>
                </label>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-32 h-20 object-cover rounded"
                  />
                ) : (
                  <img
                    src={form.image_url}
                    alt="current"
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept={FILE_TYPES}
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFile}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
