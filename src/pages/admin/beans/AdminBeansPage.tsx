// ─── AdminBeansPage ───────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, ConfirmModal, Pagination } from '../../../components/admin/Adminshared';
import { adminBeansService } from '../../../services/adminService';
import type { AdminBean } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


export function AdminBeansPage() {
  const navigate = useNavigate();
  const [beans, setBeans] = useState<AdminBean[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roastFilter, setRoastFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');

  const LIMIT = 15;

const load = async () => {
  setLoading(true);
  try {
    const params = { 
      search, 
      page,
      roastLevel: roastFilter || undefined,
      isAvailable: statusFilter === 'true' ? true : statusFilter === 'false' ? false : undefined
    };
    console.log('Request params:', params);  // ← ADD THIS
    
    const res = await adminBeansService.getAll(params);
    console.log('API Response:', res);  // ← ADD THIS
    
    setBeans(res.data?.data ?? []);
    setTotal(res.data?.total ?? 0);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to load beans');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, [page, search, roastFilter, statusFilter]);

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await adminBeansService.remove(delId);
      toast.success('Bean deleted');
      setDelId(null);
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
  try {
    await adminBeansService.toggleAvailability(id, isAvailable);
    toast.success(`Bean ${isAvailable ? 'available' : 'hidden'} successfully`);
    load(); // Refresh the list
  } catch (error) {
    console.error('Error toggling availability:', error);
    toast.error('Failed to update status');
  }
};

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (r: AdminBean) => {
        const imgUrl = getImageUrlFromObject(r);
        return (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={imgUrl}
              alt={r.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Failed to load bean image:', imgUrl);
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Name',
      render: (r: AdminBean) => (
        <div>
          <p className="font-medium text-gray-800">{r.name}</p>
          <p className="text-xs text-gray-400">{r.origin} · {r.weight}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (r: AdminBean) => `$${Number(r.price).toFixed(2)}`
    },
    {
      key: 'isDark',
      header: 'Roast',
      render: (r: AdminBean) => r.isDark ? 'Dark' : 'Light/Med'
    },
    {
  key: 'isAvailable',
  header: 'Status',
  render: (r: AdminBean) => (
    <button
      onClick={() => handleToggleAvailability(r.id, !r.isAvailable)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
        r.isAvailable ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
          r.isAvailable ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  ),
},
    {
      key: 'actions',
      header: '',
      render: (r: AdminBean) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/beans/${r.id}/edit`)}
            className="text-xs text-amber-700 hover:underline">
            Edit
          </button>
          <button onClick={() => setDelId(r.id)}
            className="text-xs text-red-500 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Coffee Beans</h1>
        <button
          onClick={() => navigate('/admin/beans/new')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Bean
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search beans..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2">
  <select
    value={roastFilter}
    onChange={(e) => { setRoastFilter(e.target.value); setPage(1); }}
    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
  >
    <option value="">All Roasts</option>
    <option value="light">Light</option>
    <option value="medium">Medium</option>
    <option value="dark">Dark</option>
  </select>

  <select
    value={statusFilter}
    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
  >
    <option value="">All Status</option>
    <option value="true">Available</option>
    <option value="false">Hidden</option>
  </select>
</div>

      <DataTable
        columns={columns}
        data={beans}
        loading={loading}
        keyFn={(r) => r.id}
        emptyMsg="No beans found"
      />

      <Pagination
        page={page}
        total={total}
        limit={LIMIT}
        onChange={setPage}
      />

      <ConfirmModal
        open={!!delId}
        danger
        title="Delete bean"
        message="This bean will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={deleting}
      />
    </div>
  );
}

export default AdminBeansPage;