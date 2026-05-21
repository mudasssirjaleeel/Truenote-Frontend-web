import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminProductsService, adminCategoriesService } from '../../../services/adminService';
import type { AdminCategory } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';

interface VariantRow { name: string; price: string; }
interface SizeRow { label: string; price: string; }

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', subtitle: '', description: '',
    price: '', categoryId: '', isAvailable: true,
  });
  const [variants, setVariants] = useState<VariantRow[]>([{ name: '', price: '' }]);
  const [sizes, setSizes] = useState<SizeRow[]>([{ label: '', price: '' }]);

  useEffect(() => {
    adminCategoriesService.getAll().then((r) => setCategories(r.data?.data ?? []));
    if (isEdit && id) {
      setLoading(true);
      adminProductsService.getOne(id).then((r) => {
        const p = r.data?.data ?? r.data;
        setForm({
          name: p.name ?? '',
          subtitle: p.subtitle ?? '',
          description: p.description ?? '',
          price: String(p.price ?? ''),
          categoryId: p.categoryId ?? '',
          isAvailable: p.isAvailable ?? true,
        });
        setVariants(p.variants?.length ? p.variants.map((v: { name: string; price: number }) => ({ name: v.name, price: String(v.price) })) : [{ name: '', price: '' }]);
        setSizes(p.sizes?.length ? p.sizes.map((s: { label: string; price: number }) => ({ label: s.label, price: String(s.price) })) : [{ label: '', price: '' }]);

        // Fix: Convert existing image URLs to use proxy
        const existingImages = p.imageUrls ?? (p.imageUrl ? [p.imageUrl] : []);
        const fixedImages = existingImages.map((url: string) => {
          if (url.includes('localhost:5000')) {
            return url.replace('http://localhost:5000', '');
          }
          return url;
        });
        setPreviews(fixedImages);
      }).catch((error) => {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('variants', JSON.stringify(variants.filter((v) => v.name)));
      fd.append('sizes', JSON.stringify(sizes.filter((s) => s.label)));
      images.forEach((f) => fd.append('images', f));

      if (isEdit && id) {
        await adminProductsService.update(id, fd);
        toast.success('Product updated successfully');
      } else {
        await adminProductsService.create(fd);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to fix image URLs for display
  const getDisplayImageUrl = (url: string): string => {
    if (!url) return '/placeholder.png';
    if (url.includes('localhost:5000')) {
      return url.replace('http://localhost:5000', '');
    }
    return url;
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading product data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Update product information' : 'Add a new product to your store'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Basic Information Section */}
        <div className="p-6 space-y-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-amber-500 rounded"></div>
            <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Classic Espresso Blend"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g., Rich & Smooth"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">— Select Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe your product..."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Available for purchase</span>
            </label>
          </div>
        </div>

        {/* Variants Section */}
        <div className="p-6 space-y-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded"></div>
              <h2 className="text-base font-semibold text-gray-800">Variants</h2>
            </div>
            <button
              type="button"
              onClick={() => setVariants((v) => [...v, { name: '', price: '' }])}
              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>

          {variants.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No variants added. Click "Add Variant" to create one.</p>
          )}

          {variants.map((v, i) => (
            <div key={i} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <input
                  placeholder="Variant name"
                  value={v.name}
                  onChange={(e) => setVariants((prev) => prev.map((r, j) => j === i ? { ...r, name: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="w-28">
                <input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={v.price}
                  onChange={(e) => setVariants((prev) => prev.map((r, j) => j === i ? { ...r, price: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Sizes Section */}
        <div className="p-6 space-y-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded"></div>
              <h2 className="text-base font-semibold text-gray-800">Sizes</h2>
            </div>
            <button
              type="button"
              onClick={() => setSizes((s) => [...s, { label: '', price: '' }])}
              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Size
            </button>
          </div>

          {sizes.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No sizes added. Click "Add Size" to create one.</p>
          )}

          {sizes.map((s, i) => (
            <div key={i} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <input
                  placeholder="Size label (e.g., Large)"
                  value={s.label}
                  onChange={(e) => setSizes((prev) => prev.map((r, j) => j === i ? { ...r, label: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="w-28">
                <input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={s.price}
                  onChange={(e) => setSizes((prev) => prev.map((r, j) => j === i ? { ...r, price: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setSizes((prev) => prev.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Images Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-amber-500 rounded"></div>
            <h2 className="text-base font-semibold text-gray-800">Product Images</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">Recommended: Square images, at least 500x500px</p>
          </div>

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={getDisplayImageUrl(src)}
                    alt={`Preview ${i + 1}`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 group-hover:border-amber-400 transition-all"
                    onError={(e) => {
                      console.log('Failed to load image:', src);
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}