import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ConfirmModal } from '../../../components/admin/Adminshared';
import { adminBannersService } from '../../../services/adminService';
import type { AdminBanner } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { Plus, Image as ImageIcon, Trash2, Eye, EyeOff, Link as LinkIcon, Hash, Upload, X } from 'lucide-react';
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({ linkTarget: '', sortOrder: '0', isActive: true });

  const load = () => {
    setLoading(true);
    adminBannersService.getAll()
      .then((r) => setBanners(r.data?.data ?? []))
      .catch((error) => {
        console.error('Error loading banners:', error);
        toast.error('Failed to load banners');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('linkTarget', form.linkTarget);
      fd.append('sortOrder', form.sortOrder);
      fd.append('isActive', String(form.isActive));
      images.forEach((f) => fd.append('images', f));
      await adminBannersService.create(fd);
      toast.success('Banner created successfully');
      setImages([]);
      setPreviews([]);
      setForm({ linkTarget: '', sortOrder: '0', isActive: true });
      load();
    } catch {
      toast.error('Failed to create banner');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (b: AdminBanner) => {
    const fd = new FormData();
    fd.append('isActive', String(!b.isActive));
    try {
      await adminBannersService.update(b.id, fd);
      toast.success(`Banner ${!b.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setSaving(true);
    try {
      await adminBannersService.remove(delId);
      toast.success('Banner deleted');
      setDelId(null);
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage homepage promotional banners</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {banners.length} banner{banners.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Create Banner Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-amber-500 rounded"></div>
            <h2 className="text-base font-semibold text-gray-800">Create New Banner</h2>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Link Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Link Target
                <span className="text-xs text-gray-400 ml-1">(optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.linkTarget}
                  onChange={(e) => setForm((f) => ({ ...f, linkTarget: e.target.value }))}
                  placeholder="/shop or https://example.com"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Where users will be redirected when clicking the banner</p>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sort Order
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Active (visible on homepage)</span>
          </label>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Banner Images (max 5)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
                id="banner-image-upload"
              />
              <label
                htmlFor="banner-image-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</span>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-24 h-16 rounded-lg object-cover border-2 border-gray-200 group-hover:border-amber-400 transition-all"
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

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Banner'}
            </button>
          </div>
        </form>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded"></div>
          <h2 className="text-base font-semibold text-gray-800">Existing Banners</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Loading banners...</p>
            </div>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No banners found</p>
            <p className="text-gray-400 text-xs mt-1">Create your first banner using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {banners.map((b: any) => {
              const imgUrl = getImageUrlFromObject(b);
              return (
                <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col sm:flex-row p-4 gap-4">
                    {/* Banner Image */}
                    <div className="w-full sm:w-32 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={imgUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    </div>

                    {/* Banner Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">Sort:</span>
                          <span className="text-sm font-semibold text-gray-700">{b.sortOrder}</span>
                        </div>
                        <button
                          onClick={() => toggleActive(b)}
                          className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all w-full sm:w-auto ${b.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                          {b.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </>
                          )}
                        </button>
                      </div>

                      {b.linkTarget && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <LinkIcon className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500 truncate">{b.linkTarget}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setDelId(b.id)}
                          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!delId}
        danger
        title="Delete Banner"
        message="This banner will be permanently removed from the homepage. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={saving}
      />
    </div>
  );
}