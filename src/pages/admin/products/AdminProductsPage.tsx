import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, ConfirmModal, Pagination } from '../../../components/admin/Adminshared';
import { adminProductsService } from '../../../services/adminService';
import type { AdminProduct } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const LIMIT = 15;

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminProductsService.getAll({ search, page });
      setProducts(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const handleDelete = async () => {
    if (!delId) return;
    setDeleting(true);
    try {
      await adminProductsService.remove(delId);
      toast.success('Product deleted');
      setDelId(null);
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

 

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (r: AdminProduct) => {
        const imgUrl = getImageUrlFromObject(r as any);
        return (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={imgUrl}
              alt={r.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Failed to load image:', imgUrl);
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
      render: (r: AdminProduct) => (
        <div>
          <p className="font-medium text-gray-800">{r.name}</p>
          {r.subtitle && <p className="text-xs text-gray-400">{r.subtitle}</p>}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (r: AdminProduct) => `$${Number(r.price).toFixed(2)}`
    },
    {
      key: 'category',
      header: 'Category',
      render: (r: AdminProduct) => r.category?.label ?? '—'
    },
    {
      key: 'isAvailable',
      header: 'Status',
      render: (r: AdminProduct) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {r.isAvailable ? 'Available' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (r: AdminProduct) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/products/${r.id}/edit`)}
            className="text-xs text-amber-700 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => setDelId(r.id)}
            className="text-xs text-red-500 hover:underline"
          >
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
        <h1 className="text-xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        keyFn={(r) => r.id}
        emptyMsg="No products found"
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
        title="Delete product"
        message="This product will be permanently deleted. Continue?"
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={deleting}
      />
    </div>
  );
}