"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase";
import { CategoryService } from "@/src/data/services/CategoryService";
import { getToken } from "@/src/data/services/util";
import { Subcategory } from "@/src/types/Category";

const FILE_TYPES = "image/*";

const SubcategoriesPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const category_id = params?.id as string | undefined;

  const [subs, setSubs] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- edit modal ---------------- */
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [form, setForm] = useState({ name: "", order: 0, image_url: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- create modal -------------- */
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    order: 0,
    image: null as File | null,
    preview: null as string | null,
  });
  const createFileRef = useRef<HTMLInputElement>(null);

  /* ---------------- fetch --------------------- */
  const fetchSubs = async () => {
    if (!category_id) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");
      const data = await CategoryService.getAllSubcategories(
        token,
        category_id
      );
      setSubs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubs();
  }, [category_id]);

  /* ---------------- helpers ------------------- */
  const handleChange = (k: keyof typeof form, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ---------------- save edit ----------------- */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const token = await getToken();
      if (!token) return;
      let finalImageUrl = form.image_url;
      if (selectedFile) {
        const ref = storageRef(
          storage,
          `subcategories/${editing.subcategory_id}-${Date.now()}`
        );
        await uploadBytes(ref, selectedFile);
        finalImageUrl = await getDownloadURL(ref);
      }
      await CategoryService.updateSubCategory(token, editing.subcategory_id, {
        name: form.name.trim(),
        order: Number(form.order),
        image_url: finalImageUrl,
      });
      setShowModal(false);
      await fetchSubs();
    } catch (err) {
      console.error(err);
      alert("Failed to update subcategory");
    }
  };

  const openEdit = (subcategory: Subcategory) => {
    setEditing(subcategory);
    setForm({
      name: subcategory.name,
      order: subcategory.order,
      image_url: subcategory.image_url,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  /* ---------------- create new ---------------- */
  const handleCreateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setCreateForm((p) => ({
        ...p,
        image: f,
        preview: URL.createObjectURL(f),
      }));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category_id) return;
    try {
      const token = await getToken();
      if (!token) return;
      let imageUrl = "";
      if (createForm.image) {
        const ref = storageRef(
          storage,
          `subcategories/${category_id}-${Date.now()}`
        );
        await uploadBytes(ref, createForm.image);
        imageUrl = await getDownloadURL(ref);
      }
      await CategoryService.createSubCategory(token, {
        category_id,
        name: createForm.name.trim(),
        order: Number(createForm.order),
        image_url: imageUrl,
      });
      setShowCreate(false);
      setCreateForm({ name: "", order: 0, image: null, preview: null });
      await fetchSubs();
    } catch (err) {
      console.error(err);
      alert("Failed to create subcategory");
    }
  };

  /* ---------------- UI ------------------------ */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-blue-600 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Subcategories</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Add New
        </button>
      </div>

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
              {subs.map((s, i) => (
                <tr
                  key={s.subcategory_id}
                  className={i % 2 ? "bg-gray-50" : "bg-gray-100"}
                >
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.order}</td>
                  <td className="p-2">
                    <img
                      src={s.image_url}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Subcategory</h2>
            <form
              onSubmit={handleCreate}
              className="flex flex-col gap-4 text-sm"
            >
              <div className="flex flex-col gap-1">
                <label className="font-medium">Name</label>
                <input
                  className="border px-3 py-2 rounded"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Order</label>
                <input
                  type="number"
                  className="border px-3 py-2 rounded"
                  value={createForm.order}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      order: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium flex items-center gap-3">
                  Image{" "}
                  <button
                    type="button"
                    onClick={() => createFileRef.current?.click()}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Choose
                  </button>
                </label>
                {createForm.preview && (
                  <img
                    src={createForm.preview}
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept={FILE_TYPES}
                  className="hidden"
                  ref={createFileRef}
                  onChange={handleCreateFile}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
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

      {/* Edit Modal (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Subcategory</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <label className="font-medium">Subcategory Name</label>
                <input
                  className="border px-3 py-2 rounded"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Order</label>
                <input
                  type="number"
                  className="border px-3 py-2 rounded"
                  value={form.order}
                  onChange={(e) => handleChange("order", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium flex items-center gap-3">
                  Image{" "}
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
                    className="w-32 h-20 object-cover rounded"
                  />
                ) : (
                  <img
                    src={form.image_url}
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

export default SubcategoriesPage;
