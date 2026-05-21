import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import toast from 'react-hot-toast'
import { orderService } from '@/services/orderService'

// ── Types ─────────────────────────────────────────────────────────────────────
interface OrderItemDisplay {
  name: string
  qty: number
  image?: string
}

interface OrderDisplay {
  id: string
  orderNumber: string
  status: string
  items: OrderItemDisplay[]
  total: string
  createdAt: string
  deliveryMethod: string
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#474653" />
    <path d="M19 10l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancelOrder }: { order: OrderDisplay; onCancelOrder: (id: string) => void }) => (
  <div
    className="w-full flex flex-col gap-4 p-4 rounded-2xl"
    style={{ background: '#F6DDC5' }}
  >
    {/* order number + status + date */}
    <div className="flex items-center justify-between flex-wrap gap-2">
      <span className="text-[#333] text-base font-normal" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {order.orderNumber}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-normal" style={{ fontFamily: "'League Spartan', sans-serif", color: 'rgba(51,51,51,0.50)' }}>
          {order.createdAt}
        </span>
        <span className="text-sm font-normal text-right px-2 py-1 rounded-full" style={{
          fontFamily: "'League Spartan', sans-serif",
          color: order.status === 'delivered' ? '#10B981' : order.status === 'cancelled' ? '#EF4444' : '#F59E0B',
          background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7'
        }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
        </span>
        {/* Cancel Button - only show for pending orders */}
        {order.status === 'pending' && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="mt-2 w-auto px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>

    {/* line items */}
    {order.items.map((item, i) => (
      <div key={i} className="flex items-center justify-between">
        <span className="text-sm font-normal" style={{ fontFamily: "'League Spartan', sans-serif", color: 'rgba(51,51,51,0.50)' }}>
          {item.name}
        </span>
        <span className="text-sm font-normal text-[#333]" style={{ fontFamily: "'League Spartan', sans-serif" }}>
          {item.qty}x
        </span>
      </div>
    ))}

    {/* total */}
    <div className="flex items-center justify-between pt-2 border-t border-[rgba(0,0,0,0.1)]">
      <span className="text-sm font-normal" style={{ fontFamily: "'League Spartan', sans-serif", color: 'rgba(51,51,51,0.50)' }}>
        Total
      </span>
      <span className="text-base font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {order.total}
      </span>
    </div>


  </div>
)

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="w-full flex flex-col gap-4 p-4 rounded-2xl animate-pulse" style={{ background: '#F6DDC5' }}>
        <div className="flex justify-between">
          <div className="h-5 bg-[#D5B89D] rounded w-28" />
          <div className="h-4 bg-[#D5B89D] rounded w-20" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-[#D5B89D] rounded w-full" />
          <div className="h-4 bg-[#D5B89D] rounded w-3/4" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-[#D5B89D] rounded w-16" />
          <div className="h-5 bg-[#D5B89D] rounded w-20" />
        </div>
      </div>
    ))}
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const OrderHistoryPage = () => {
  const navigate = useNavigate()
  const { orders, loading, error, getUserOrders } = useOrders()
  const [orderList, setOrderList] = useState<OrderDisplay[]>([])

  useEffect(() => {
    getUserOrders(1, 50)
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleCancelOrder = async (orderId: string) => {
    try {
      const result = await orderService.cancelOrder(orderId);
      toast.success(result.message || 'Order cancelled successfully');
      // Refresh orders list
      getUserOrders(1, 50);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to cancel order';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      const formattedOrders: OrderDisplay[] = orders.map((order: any) => ({
        id: order.id,
        orderNumber: `#TN-${order.id.slice(-8).toUpperCase()}`,
        status: order.status,
        createdAt: new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        items: [],
        total: `$${Number(order.total).toFixed(2)}`,
        deliveryMethod: order.deliveryMethod,
        itemCount: order.itemCount || 0,
      }))
      setOrderList(formattedOrders)
    }
  }, [orders])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
      {/* side white glows */}
      <div className="absolute z-0 pointer-events-none hidden sm:block"
        style={{ width: 309, height: 933, left: -175, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />
      <div className="absolute z-0 pointer-events-none hidden sm:block"
        style={{ width: 309, height: 933, left: 1236, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-[80px] pt-[80px] sm:pt-[150px] lg:pt-[166px] pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 md:mt-8">
            <div>
              <div className='md:flex md:gap-3 md:items-center md:justify-start'>
                <button onClick={() => navigate(-1)} className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1">
                  <BackArrow />
                </button>
                <h1 className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Order History
                </h1>
              </div>
              <p className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Track your past orders and reorder your favorite coffee anytime.
              </p>
            </div>
          </div>

          {/* ── Orders list ── */}
          {loading ? (
            <LoadingSkeleton />
          ) : orderList.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#474653] text-xl font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orderList.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderHistoryPage