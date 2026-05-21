import type { OrderStatus } from '../../types/admin.types';

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface Props {
  status: OrderStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: Props) {
  const style = ORDER_STATUS_STYLES[status as OrderStatus] ?? 'bg-gray-100 text-gray-800';
  const label = status.replace(/_/g, ' ');
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style} ${className}`}>
      {label}
    </span>
  );
}