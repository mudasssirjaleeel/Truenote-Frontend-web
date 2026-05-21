// ─── AdminCategoriesPage ──────────────────────────────────────────────────────

import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmModal } from '../../../components/admin/Adminshared';
import { adminCategoriesService } from '../../../services/adminService';
import type { AdminCategory } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export function AdminCategoriesPage() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: '', slug: '' });

  const load = () => {
    setLoading(true);
    adminCategoriesService.getAll()
      .then((r) => setCats(r.data?.data ?? []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (c: AdminCategory) => {
    setEditId(c.id);
    setForm({ label: c.label, slug: c.slug });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.slug.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await adminCategoriesService.update(editId, form);
        toast.success('Category updated');
      } else {
        await adminCategoriesService.create(form);
        toast.success('Category created');
      }
      setEditId(null);
      setForm({ label: '', slug: '' });
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setSaving(true);
    try {
      await adminCategoriesService.remove(delId);
      toast.success('Category deleted');
      setDelId(null);
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ label: '', slug: '' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Categories</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-4">
          {editId ? 'Edit Category' : 'Create New Category'}
        </p>
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 sm:hidden">Label</label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Label (e.g. Hot Drinks)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 sm:hidden">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="slug (e.g. hot-drinks)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {saving ? '...' : editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">All Categories ({cats.length})</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No categories yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first category above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cats.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.label}</p>
                  <p className="text-xs text-gray-400">/{c.slug}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDelId(c.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!delId}
        danger
        title="Delete category"
        message="This will remove the category. Products using it will become uncategorised."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={saving}
      />
    </div>
  );
}

export default AdminCategoriesPage;