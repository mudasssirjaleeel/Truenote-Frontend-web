import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminBeansService } from '../../../services/adminService';
import type { GrindOption } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react';

const GRIND_OPTIONS: GrindOption[] = ['whole_bean', 'espresso', 'v60', 'chemex', 'french_press'];

interface PlanRow { plan: 'one_time' | 'subscribe'; discount: string; description: string; }

export default function AdminBeanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', origin: '', weight: '', price: '',
    description: '', isDark: false, isAvailable: true,
  });
  const [selectedGrinds, setSelectedGrinds] = useState<GrindOption[]>([]);
  const [plans, setPlans] = useState<PlanRow[]>([
    { plan: 'one_time', discount: '', description: 'One-Time Purchase' },
  ]);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      adminBeansService.getOne(id).then((r) => {
        const b = r.data?.data ?? r.data;
        setForm({
          name: b.name ?? '',
          origin: b.origin ?? '',
          weight: b.weight ?? '',
          price: String(b.price ?? ''),
          description: b.description ?? '',
          isDark: b.isDark ?? false,
          isAvailable: b.isAvailable ?? true,
        });
        setSelectedGrinds(b.grindOptions?.map((g: { grind: GrindOption }) => g.grind) ?? []);
        setPlans(b.purchasePlans?.map((p: { plan: 'one_time' | 'subscribe'; discount?: number; description?: string }) => ({
          plan: p.plan, discount: String(p.discount ?? ''), description: p.description ?? '',
        })) ?? [{ plan: 'one_time', discount: '', description: '' }]);

        // Fix: Convert existing image URLs to use proxy
        const existingImages = b.imageUrls ?? (b.imageUrl ? [b.imageUrl] : []);
        const fixedImages = existingImages.map((url: string) => {
          if (url.includes('localhost:5000')) {
            return url.replace('http://localhost:5000', '');
          }
          return url;
        });
        setPreviews(fixedImages);
      }).catch((error) => {
        console.error('Error loading bean:', error);
        toast.error('Failed to load bean');
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const toggleGrind = (g: GrindOption) =>
    setSelectedGrinds((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

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
      fd.append('grindOptions', JSON.stringify(selectedGrinds));
      fd.append('purchasePlans', JSON.stringify(plans.map((p) => ({ ...p, discount: p.discount ? Number(p.discount) : undefined }))));
      images.forEach((f) => fd.append('images', f));

      if (isEdit && id) {
        await adminBeansService.update(id, fd);
        toast.success('Bean updated successfully');
      } else {
        await adminBeansService.create(fd);
        toast.success('Bean created successfully');
      }
      navigate('/admin/beans');
    } catch {
      toast.error('Failed to save bean');
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
        <p className="text-gray-400 text-sm">Loading bean data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/beans')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {isEdit ? 'Edit Coffee Bean' : 'Create New Coffee Bean'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Update bean information' : 'Add a new coffee bean to your store'}
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
                Bean Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Ethiopian Yirgacheffe"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Origin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                placeholder="e.g., Ethiopia"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                placeholder="e.g., 250g, 1kg"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe your coffee bean..."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDark}
                onChange={(e) => setForm((f) => ({ ...f, isDark: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Dark Roast</span>
            </label>
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

        {/* Grind Options Section */}
        <div className="p-6 space-y-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-amber-500 rounded"></div>
            <h2 className="text-base font-semibold text-gray-800">Grind Options</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {GRIND_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGrind(g)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${selectedGrinds.includes(g)
                  ? 'bg-amber-500 border-amber-500 text-stone-900 font-semibold shadow-sm'
                  : 'border-gray-300 text-gray-600 hover:border-amber-400 hover:bg-amber-50'
                  }`}
              >
                {g.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Plans Section */}
        <div className="p-4 sm:p-6 space-y-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded"></div>
              <h2 className="text-base font-semibold text-gray-800">Purchase Plans</h2>
            </div>
            <button
              type="button"
              onClick={() => setPlans((p) => [...p, { plan: 'subscribe', discount: '10', description: 'Subscribe & Save' }])}
              className="flex items-center justify-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Plan
            </button>
          </div>

          {plans.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No purchase plans added. Click "Add Plan" to create one.</p>
          )}

          {plans.map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gray-50 p-3 sm:p-4 rounded-lg">
              {/* Plan Type Select */}
              <div className="w-full sm:w-auto sm:flex-1">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Plan Type</label>
                <select
                  value={p.plan}
                  onChange={(e) => setPlans((prev) => prev.map((r, j) => j === i ? { ...r, plan: e.target.value as 'one_time' | 'subscribe' } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="one_time">One time</option>
                  <option value="subscribe">Subscribe</option>
                </select>
              </div>

              {/* Discount Input */}
              <div className="w-full sm:w-28">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Discount %</label>
                <input
                  placeholder="Discount %"
                  type="number"
                  value={p.discount}
                  onChange={(e) => setPlans((prev) => prev.map((r, j) => j === i ? { ...r, discount: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Description Input */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Description</label>
                <input
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => setPlans((prev) => prev.map((r, j) => j === i ? { ...r, description: e.target.value } : r))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Delete Button */}
              <div className="flex justify-end sm:justify-start">
                <button
                  type="button"
                  onClick={() => setPlans((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 transition-colors p-2 sm:p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Images Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-amber-500 rounded"></div>
            <h2 className="text-base font-semibold text-gray-800">Bean Images</h2>
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
            onClick={() => navigate('/admin/beans')}
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
            {saving ? 'Saving...' : isEdit ? 'Update Bean' : 'Create Bean'}
          </button>
        </div>
      </form>
    </div>
  );
}