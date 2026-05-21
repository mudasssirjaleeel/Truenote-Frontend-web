import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useWishlist } from '@/hooks/useWishlist'
import toast from 'react-hot-toast'
import pack_01 from '../../assets/images/pack_01.svg'
import remove_icon from '../../assets/images/remove_icon.svg'
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';

import { useCart } from '@/hooks/useCart'
// ── Types ─────────────────────────────────────────────────────────────────────
interface WishlistItem {
  id: string
  wishlistId: string
  image: string
  name: string
  subtitle: string
  detail?: string
  price: string
  type: 'coffee' | 'bean'
  isAvailable: boolean
}


// ── Cart icon ─────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 1h1.5l1 5h6l1-4H3.5" stroke="#E2C4A7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="10.5" r="0.75" fill="#E2C4A7" />
    <circle cx="9" cy="10.5" r="0.75" fill="#E2C4A7" />
  </svg>
)

// ── Back arrow ────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#474653" />
    <path d="M19 10l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-full flex items-center gap-4 p-4 rounded-2xl animate-pulse"
        style={{ background: '#F6DDC5' }}
      >
        <div className="w-[62px] h-[78px] bg-[#D5B89D] rounded-lg flex-shrink-0" />
        <div className="flex-1 flex justify-between items-end gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-[#D5B89D] rounded w-32" />
            <div className="h-4 bg-[#D5B89D] rounded w-24" />
            <div className="h-6 bg-[#D5B89D] rounded w-16" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-6 h-6 bg-[#D5B89D] rounded-full" />
            <div className="w-8 h-8 bg-[#D5B89D] rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
)
 



// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-6">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#474653" fillOpacity="0.3" stroke="#474653" strokeWidth="1.5" />
    </svg>
    <p className="text-[#474653] text-xl font-medium text-center" style={{ fontFamily: "'League Spartan', sans-serif" }}>
      Your wishlist is empty.
    </p>
    <Link
      to="/coffee-beans"
      className="px-6 py-3 bg-[#474653] text-[#F7D5A0] rounded-full hover:bg-[#5a5a6b] transition-colors"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      Explore Coffee Beans
    </Link>
  </div>
)

// ── Wishlist Item Card ────────────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onAddToCart }: {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
}) => (
  <div
    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all hover:scale-[1.02]"
    style={{ background: '#F6DDC5' }}
  >
    {/* product image */}
    <img
      src={item.image}
      alt={item.name}
      className={`object-cover flex-shrink-0 ${item.type === 'coffee'
        ? 'w-[50px] h-[50px] sm:w-[62px] sm:h-[62px] rounded-2xl'
        : 'w-[50px] h-[65px] sm:w-[62px] sm:h-[78px] rounded-lg'
        }`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = pack_01
      }}
    />

    {/* info + actions */}
    <div className="flex-1 flex justify-between items-end min-w-0 gap-2 sm:gap-4">

      {/* left: name, subtitle, detail, price */}
      <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex flex-col gap-1 sm:gap-2">
            <span
              className="text-[#333] text-sm sm:text-base font-medium leading-tight sm:leading-none truncate"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {item.name}
            </span>
            <span
              className="text-xs sm:text-base font-medium leading-tight sm:leading-none truncate"
              style={{ fontFamily: "'League Spartan', sans-serif", color: item.type === 'bean' ? 'rgba(51,51,51,0.70)' : 'rgba(51,51,51,0.50)' }}
            >
              {item.subtitle}
            </span>
          </div>
          {item.detail && (
            <span
              className="text-xs sm:text-base font-normal leading-tight sm:leading-none truncate"
              style={{ fontFamily: "'League Spartan', sans-serif", color: 'rgba(51,51,51,0.50)' }}
            >
              {item.detail}
            </span>
          )}
        </div>
        <span
          className="text-base sm:text-xl font-bold text-[#474653]"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {item.price}
        </span>
      </div>

      {/* right: remove top, add to cart bottom */}
      <div className="flex flex-col justify-between items-center self-stretch gap-2 sm:gap-4">
        <button
          onClick={() => onRemove(item.wishlistId)}
          className="hover:opacity-70 transition-opacity flex-shrink-0 p-1"
          aria-label="Remove from wishlist"
        >
          <img src={remove_icon} alt="Remove" />
        </button>
        <button
          onClick={() => onAddToCart(item)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: '#474653', borderRadius: 12 }}
          aria-label="Add to cart"
        >
          <span className='flex items-center text-[#E2C4A7] text-lg font-bold'>+</span>
        </button>
      </div>
    </div>
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const WishlistPage = () => {
  const navigate = useNavigate()
  const { wishlist, loading, removeItem, getWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    getWishlist()
  }, [])

  useEffect(() => {
    if (wishlist && wishlist.length > 0) {
      const formattedItems: WishlistItem[] = wishlist.map((item) => ({
        id: item.id,
        wishlistId: item.wishlistId,
        name: item.name,
        subtitle: item.type === 'bean' ? item.origin || '' : item.subtitle || '',
        detail: item.type === 'bean' && item.weight ? `${item.weight}g • ${item.isDark ? 'Dark' : 'Light'} Roast` : undefined,
        price: `$${Number(item.price).toFixed(2)}`,
        type: item.type,
        image: getImageUrl(item.imageUrl) || pack_01,
        isAvailable: item.isAvailable,
      }))
      setItems(formattedItems)
    } else {
      setItems([])
    }
  }, [wishlist])

  const handleRemove = async (wishlistId: string) => {
    await removeItem(wishlistId)
  }

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addToCart({
        type: item.type,
        ...(item.type === 'bean'
          ? { beanId: item.id }
          : { productId: item.id }
        ),
        quantity: 1,
      })
    } catch (error) {
      toast.error('Failed to add to cart', {
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }

  // Determine if we should show loading skeleton
  const showLoadingSkeleton = loading && items.length === 0

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">

      {/* Side white glows - hide on mobile */}
      <div className="absolute z-0 pointer-events-none hidden lg:block"
        style={{ width: 309, height: 933, left: -175, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />
      <div className="absolute z-0 pointer-events-none hidden lg:block"
        style={{ width: 309, height: 933, left: 'auto', right: -175, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />



      {/* ── Content ── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[80px] pt-[100px] sm:pt-[130px] lg:pt-[150px] pb-12 sm:pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6 sm:gap-8">


          <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-4 lg:mb-8 md:mt-8">

            <div>
              <div className='md:flex md:gap-3 md:items-center md:justify-start'>
                <button onClick={() => navigate(-1)} className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1">
                  <BackArrow />
                </button>
                <h1 className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>

                  Your Wishlist
                </h1>
              </div>

              <p className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 
                                        md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Save your favorite coffees and beans for later.
              </p>
            </div>
          </div>


          {/* ── Items list ── */}
          {showLoadingSkeleton ? (
            <LoadingSkeleton />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {items.map(item => (
                <WishlistCard
                  key={item.wishlistId}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Wishlist count badge */}
          {items.length > 0 && (
            <div className="flex justify-end mt-2">
              <span
                className="text-sm text-[#474653]/60"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {items.length} {items.length === 1 ? 'item' : 'items'} in wishlist
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default WishlistPage