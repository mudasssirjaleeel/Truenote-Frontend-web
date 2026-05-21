import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useCart } from '@/hooks/useCart'
import { useOrders } from '@/hooks/useOrders'
import { useAddress } from '@/hooks/useAddress'
import toast from 'react-hot-toast'
import pack_01 from '../../assets/images/pack_01.svg'
import orderBg from '../../assets/svgs/button_bg.svg'
import remove_icon from '../../assets/images/remove_icon.svg'
import { getImageUrl, getImageUrlFromObject } from '@/utils/imageUrl';


// ── Types ─────────────────────────────────────────────────────────────────────
interface CartItemDisplay {
    id: string
    cartId: string
    name: string
    subtitle: string
    detail?: string
    price: number
    quantity: number
    image: string
    type: 'coffee' | 'bean'
    isAvailable: boolean
}

interface ContactInfo {
    contactName: string
    contactPhone: string
    contactEmail: string
    addressLine?: string
    addressCity?: string
    addressProvince?: string
    addressPostal?: string
}

 

// ── Icons ─────────────────────────────────────────────────────────────────────
const RemoveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2L12 12M12 2L2 12" stroke="#2C2A22" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

const MinusIcon = () => (
    <svg width="12" height="3" viewBox="0 0 12 3" fill="none">
        <path d="M0 1.5H12" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0V12M0 6H12" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const BackArrow = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#474653" />
        <path d="M19 10l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="#474653" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

// ── Cart Item Card ─────────────────────────────────────────────────────────────
const CartItemCard = ({ item, onUpdateQuantity, onRemove }: {
    item: CartItemDisplay
    onUpdateQuantity: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}) => (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#F6DDC5]">
        <img
            src={item.image}
            alt={item.name}
            className={`object-cover flex-shrink-0 ${item.type === 'coffee'
                ? 'w-[50px] h-[50px] sm:w-[62px] sm:h-[62px] rounded-2xl'
                : 'w-[50px] h-[65px] sm:w-[62px] sm:h-[78px] rounded-lg'
                }`}
            onError={(e) => { (e.target as HTMLImageElement).src = pack_01 }}
        />

        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div className="flex-1 space-y-2 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-[#333333] text-sm sm:text-base font-semibold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {item.name}
                        </h3>
                        <p className="text-[rgba(51,51,51,0.70)] text-xs sm:text-sm font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {item.subtitle}
                        </p>
                    </div>
                    {item.detail && (
                        <p className="text-[rgba(51,51,51,0.50)] text-xs sm:text-sm font-normal" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {item.detail}
                        </p>
                    )}
                </div>
                <p className="text-[#474653] text-base sm:text-xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
            </div>

            <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-between w-full sm:w-auto gap-4">
                <button
                    onClick={() => onRemove(item.cartId)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FACEA2] rounded-xl flex items-center justify-center hover:bg-[#e8b880] transition-colors cursor-pointer"
                    aria-label="Remove item"
                >
                    <img src={remove_icon} alt="" />
                </button>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => onUpdateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FACEA2] rounded-xl flex items-center justify-center hover:bg-[#e8b880] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon />
                    </button>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-[rgba(71,70,83,0.50)]">
                        <span className="text-sm sm:text-base font-bold text-[#333333]" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {item.quantity}
                        </span>
                    </div>
                    <button
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FACEA2] rounded-xl flex items-center justify-center hover:bg-[#e8b880] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                    >
                        <PlusIcon />
                    </button>
                </div>

            </div>
        </div>
    </div>
)

// ── Loading Skeleton ───────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#F6DDC5] animate-pulse">
                <div className="w-[50px] h-[65px] sm:w-[62px] sm:h-[78px] bg-[#D5B89D] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                        <div className="h-4 sm:h-5 bg-[#D5B89D] rounded w-32" />
                        <div className="h-3 sm:h-4 bg-[#D5B89D] rounded w-24" />
                    </div>
                    <div className="h-5 sm:h-6 bg-[#D5B89D] rounded w-16" />
                </div>
                <div className="flex gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#D5B89D] rounded-xl" />
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D5B89D] rounded-xl" />
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#D5B89D] rounded-xl" />
                </div>
            </div>
        ))}
    </div>
)

// ── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l1 5m0 0h13l1-4H6.5M6 8l-1 9h14M7 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                stroke="#474653" strokeWidth="1.5" fill="none" />
            <circle cx="7" cy="20" r="1.5" fill="#474653" />
            <circle cx="17" cy="20" r="1.5" fill="#474653" />
        </svg>
        <p className="text-[#474653] text-xl font-medium text-center" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            Your cart is empty.
        </p>
        <Link
            to="/coffee_beans"
            className="px-6 py-3 bg-[#474653] text-[#F7D5A0] rounded-full hover:bg-[#5a5a6b] transition-colors"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
            Start Shopping
        </Link>
    </div>
)

// ── Delivery Options ───────────────────────────────────────────────────────────
const DeliveryOptions = ({ selectedMethod, onSelect }: {
    selectedMethod: 'pickup' | 'delivery'
    onSelect: (method: 'pickup' | 'delivery') => void
}) => (
    <div className="w-full p-4 sm:p-6 border-b border-[rgba(0,0,0,0.1)]">
        <h3 className="text-[#333333] text-sm sm:text-base font-semibold mb-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            How would you like to receive your order?
        </h3>
        <div className="space-y-4 border border-[rgba(51,51,51,0.50)] p-4 rounded-2xl">
            {[
                { id: 'pickup', label: 'Pickup from Café', sub: 'Ready in 10–15 minutes.' },
                { id: 'delivery', label: 'Delivery', sub: 'Estimated delivery 30–40 minutes.' },
            ].map((opt) => (
                <div
                    key={opt.id}
                    onClick={() => onSelect(opt.id as 'pickup' | 'delivery')}
                    className="flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <div>
                        <p className="text-[#333333] text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>{opt.label}</p>
                        <p className="text-[rgba(51,51,51,0.70)] text-xs sm:text-sm font-medium mt-1" style={{ fontFamily: "'League Spartan', sans-serif" }}>{opt.sub}</p>
                    </div>
                    <div className="relative w-4 h-4 flex-shrink-0">
                        <div className={`absolute inset-0 rounded-full transition-all ${selectedMethod === opt.id ? 'border-2 border-[#333333] bg-[#333333]' : 'border border-[#333333]'
                            }`}>
                            {selectedMethod === opt.id && <div className="absolute inset-[3px] rounded-full bg-white" />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// ── Checkout Modal ─────────────────────────────────────────────────────────────
// ── Checkout Modal ─────────────────────────────────────────────────────────────
const CheckoutModal = ({ open, onClose, onConfirm, deliveryMethod, total, loading }: {
    open: boolean
    onClose: () => void
    onConfirm: (data: ContactInfo) => void
    deliveryMethod: 'pickup' | 'delivery'
    total: number
    loading: boolean
}) => {
    const { addresses, getAddresses, addAddress } = useAddress()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false)
    const [formData, setFormData] = useState<ContactInfo>({
        contactName: user?.name || '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        addressLine: '',
        addressCity: '',
        addressProvince: '',
        addressPostal: '',
    })

    useEffect(() => {
        if (open) {
            getAddresses()
            setShowNewAddressForm(false)
            setSelectedAddressId('')
            setFormData({
                contactName: user?.name || '',
                contactPhone: user?.phone || '',
                contactEmail: user?.email || '',
                addressLine: '',
                addressCity: '',
                addressProvince: '',
                addressPostal: '',
            })
        }
    }, [open])

    const handleAddressSelect = (addressId: string) => {
        if (addressId === 'new') {
            setShowNewAddressForm(true)
            setSelectedAddressId('')
            setFormData(prev => ({
                ...prev,
                addressLine: '',
                addressCity: '',
                addressProvince: '',
                addressPostal: '',
            }))
        } else {
            setShowNewAddressForm(false)
            setSelectedAddressId(addressId)
            const selected = addresses.find(addr => addr.id === addressId)
            if (selected) {
                setFormData(prev => ({
                    ...prev,
                    addressLine: selected.street,
                    addressCity: selected.city,
                    addressProvince: selected.addressProvince || '',
                    addressPostal: selected.postalCode,
                }))
            }
        }
    }

    const handleInputChange = (field: keyof ContactInfo, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'addressLine' || field === 'addressCity' || field === 'addressProvince' || field === 'addressPostal') {
            setSelectedAddressId('')
        }
    }

    const handleSubmit = async () => {
        if (!formData.contactName || !formData.contactPhone || !formData.contactEmail) {
            toast.error('Please fill in all contact details')
            return
        }
        if (deliveryMethod === 'delivery' && (!formData.addressLine || !formData.addressCity)) {
            toast.error('Please fill in delivery address')
            return
        }
        onConfirm(formData)
    }

    if (!open) return null

    const inputCls = "w-full px-4 py-3 rounded-xl border border-[rgba(71,70,83,0.40)] bg-transparent text-[#333] placeholder-[rgba(51,51,51,0.50)] text-sm focus:outline-[#474653] transition-all"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-[#F6DDC5] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#F6DDC5] p-6 border-b border-[rgba(0,0,0,0.1)] flex justify-between items-center">
                    <h2 className="text-[#474653] text-2xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                        Confirm Your Order
                    </h2>
                    <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                        <CloseIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-[#333333] text-lg font-semibold mb-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.contactName}
                                onChange={(e) => handleInputChange('contactName', e.target.value)}
                                className={inputCls}
                                style={{ fontFamily: "'League Spartan', sans-serif" }}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.contactPhone}
                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                className={inputCls}
                                style={{ fontFamily: "'League Spartan', sans-serif" }}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.contactEmail}
                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                className={inputCls}
                                style={{ fontFamily: "'League Spartan', sans-serif" }}
                            />
                        </div>
                    </div>

                    {/* Delivery Address (only for delivery) */}
                    {deliveryMethod === 'delivery' && (
                        <div>
                            <h3 className="text-[#333333] text-lg font-semibold mb-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                Delivery Address
                            </h3>

                            {/* Address Selection Dropdown */}
                            <div className="mb-4">
                                <label className="text-sm text-[#474653] font-medium mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                    Select Address Option
                                </label>
                                <select
                                    value={showNewAddressForm ? 'new' : selectedAddressId}
                                    onChange={(e) => handleAddressSelect(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgba(71,70,83,0.40)] bg-white text-[#333] text-sm focus:outline-[#474653]"
                                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                                >
                                    <option value="">-- Select an option --</option>
                                    {addresses.length > 0 && (
                                        <optgroup label="Saved Addresses">
                                            {addresses.map(addr => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.label}: {addr.street}, {addr.city}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                    <option value="new">+ Add New Address</option>
                                </select>
                            </div>

                            {/* New Address Form */}
                            {showNewAddressForm && (
                                <div className="space-y-3 mt-4 p-4 rounded-xl border border-[rgba(71,70,83,0.30)] bg-white/20">
                                    <h4 className="text-[#474653] font-semibold text-sm mb-2" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        Enter New Address
                                    </h4>
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        value={formData.addressLine}
                                        onChange={(e) => handleInputChange('addressLine', e.target.value)}
                                        className={inputCls}
                                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={formData.addressCity}
                                        onChange={(e) => handleInputChange('addressCity', e.target.value)}
                                        className={inputCls}
                                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                                    />
                                    <div className="md:flex gap-3 sm:space-y-0 space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Province/State"
                                            value={formData.addressProvince}
                                            onChange={(e) => handleInputChange('addressProvince', e.target.value)}
                                            className="flex-1 px-4 py-3 w-full rounded-xl border border-[rgba(71,70,83,0.40)] bg-transparent text-[#333] placeholder-[rgba(51,51,51,0.50)] text-sm focus:outline-[#474653]"
                                            style={{ fontFamily: "'League Spartan', sans-serif" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postal Code"
                                            value={formData.addressPostal}
                                            onChange={(e) => handleInputChange('addressPostal', e.target.value)}
                                            className="flex-1 px-4 py-3 w-full rounded-xl border border-[rgba(71,70,83,0.40)] bg-transparent text-[#333] placeholder-[rgba(51,51,51,0.50)] text-sm focus:outline-[#474653]"
                                            style={{ fontFamily: "'League Spartan', sans-serif" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Display selected saved address (non-editable preview) */}
                            {!showNewAddressForm && selectedAddressId && (
                                <div className="mt-4 p-3 rounded-xl bg-white/20 text-sm" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                    <p className="text-[#333]">{formData.addressLine}</p>
                                    <p className="text-[#333]">{formData.addressCity}</p>
                                    {(formData.addressProvince || formData.addressPostal) && (
                                        <p className="text-[#333]">{formData.addressProvince} {formData.addressPostal}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white/20 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[#333333] text-lg font-semibold" style={{ fontFamily: "'League Spartan', sans-serif" }}>Total Amount</span>
                            <span className="text-[#474653] text-2xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#F6DDC5] p-6 border-t border-[rgba(0,0,0,0.1)] flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-[#474653] text-[#474653] font-semibold hover:bg-[#474653]/5 transition-colors"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-[#474653] text-white font-semibold hover:bg-[#5a5a6b] transition-colors disabled:opacity-50"
                        style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                        {loading ? 'Placing Order...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Cart Page ─────────────────────────────────────────────────────────────
const CartPage = () => {
    const navigate = useNavigate()
    const { cart, loading, updateItem, removeItem, getCart } = useCart()
    const { placeOrder, loading: orderLoading } = useOrders()
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
    const [cartItems, setCartItems] = useState<CartItemDisplay[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => { getCart() }, [])

    useEffect(() => {
        if (cart && cart.length > 0) {
            const formattedItems: CartItemDisplay[] = cart.map((item: any) => {
                if (item.type === 'coffee') {
                    return {
                        id: item.id, cartId: item.id,
                        name: item.product?.name || 'Coffee',
                        subtitle: item.size?.label || item.variant?.name || '',
                        detail: item.grind?.grind ? `Grind: ${item.grind.grind}` : undefined,
                        price: item.unitPrice, quantity: item.quantity,
                        image: getImageUrl(item.product?.imageUrl) || pack_01,
                        type: 'coffee', isAvailable: true,
                    }
                } else {
                    return {
                        id: item.id, cartId: item.id,
                        name: item.bean?.name || 'Coffee Bean',
                        subtitle: item.bean?.origin || '',
                        detail: `${item.bean?.weight}g • ${item.plan?.plan || 'One Time'}`,
                        price: item.unitPrice, quantity: item.quantity,
                        image: getImageUrl(item.bean?.imageUrl) || pack_01,
                        type: 'bean', isAvailable: true,
                    }
                }
            })
            setCartItems(formattedItems)
        } else {
            setCartItems([])
        }
    }, [cart])

    const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const calculateDeliveryFee = () => selectedDeliveryMethod === 'delivery' ? 5.00 : 0
    const calculateTotal = () => calculateSubtotal() + calculateDeliveryFee()

    const handleConfirmOrder = async (contactInfo: ContactInfo) => {
        const orderData: any = {
            deliveryMethod: selectedDeliveryMethod,
            contactName: contactInfo.contactName,
            contactPhone: contactInfo.contactPhone,
            contactEmail: contactInfo.contactEmail,
        }

        if (selectedDeliveryMethod === 'delivery') {
            orderData.addressLine = contactInfo.addressLine
            orderData.addressCity = contactInfo.addressCity
            orderData.addressProvince = contactInfo.addressProvince
            orderData.addressPostal = contactInfo.addressPostal
        }

        const result = await placeOrder(orderData)
        if (result) {
            setIsModalOpen(false)
            navigate('/order_history')
        }
    }

    const handleOpenModal = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty')
            return
        }
        setIsModalOpen(true)
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#E2C4A7] to-[#d4b494]">

            {/* Background Glows */}
            <div className="absolute z-0 pointer-events-none hidden lg:block"
                style={{ width: 405, height: 1051, left: -271, top: 239, background: '#F6DDC5', borderRadius: 9999, filter: 'blur(216.65px)' }} />
            <div className="absolute z-0 pointer-events-none hidden lg:block"
                style={{ width: 455, height: 1019, right: -100, top: 0, background: '#F6DDC5', filter: 'blur(125px)' }} />


            {/* ── Two-column layout ── */}
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

                {/* ── LEFT: Cart items ── */}
                <div className={`flex-1 w-full px-4 sm:px-6 lg:px-20 pt-[100px] sm:pt-[130px] pb-12 ${cartItems.length > 0 ? 'lg:pr-8 lg:mr-[480px]' : ''}`}>
                    <div className="w-full">

                        {/* Page heading */}
                        <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 md:mt-8">
                            <div>
                                <div className='md:flex md:gap-3 md:items-center md:justify-start'>
                                    <button onClick={() => navigate(-1)} className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1">
                                        <BackArrow />
                                    </button>
                                    <h1 className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        Your Cart
                                    </h1>
                                </div>
                                <p className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                    Review your items before checkout.
                                </p>
                            </div>
                        </div>

                        {/* Section title */}
                        <h2 className="text-[#474653] text-[20px] md:text-[32px] lg:text-[36px] 2xl:text-[40px] font-semibold mb-4 sm:mb-6 md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            Product Items
                        </h2>

                        {/* Cart items */}
                        <div className="space-y-4 w-full lg:pl-12">
                            {loading ? (
                                <LoadingSkeleton />
                            ) : cartItems.length === 0 ? (
                                <EmptyState />
                            ) : (
                                cartItems.map(item => (
                                    <CartItemCard
                                        key={item.cartId}
                                        item={item}
                                        onUpdateQuantity={async (id, qty) => updateItem(id, qty)}
                                        onRemove={async (id) => removeItem(id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Order summary ── */}
                {cartItems.length > 0 && (
                    <div className="w-full bg-[#F6DDC5] lg:w-[480px] lg:fixed lg:right-0 lg:top-0 lg:h-screen lg:overflow-y-auto flex-shrink-0">
                        <div className="flex flex-col h-full pt-0 lg:pt-[100px]">

                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-4 pt-6 lg:pt-4 pb-4">
                                <div className="rounded-2xl overflow-hidden">
                                    <DeliveryOptions
                                        selectedMethod={selectedDeliveryMethod}
                                        onSelect={setSelectedDeliveryMethod}
                                    />
                                    <div className="p-4 sm:p-6 space-y-4">
                                        <div className="">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#333333] text-[16px] sm:text-[20px] lg:text-[24px] 2xl:text-[26px] font-semibold" style={{ fontFamily: "'League Spartan', sans-serif" }}>Total</span>
                                                <span className="text-[#333333] text-[16px] sm:text-[20px] lg:text-[24px] 2xl:text-[26px] font-semibold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                                    ${calculateTotal().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order button */}
                            <div className="flex-shrink-0 px-4 sm:px-6 lg:px-4 py-4 sm:py-6">
                                <p className="text-[rgba(51,51,51,0.70)] text-xs sm:text-sm font-medium text-start pl-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                    Secure & fast checkout
                                </p>
                                <button
                                    onClick={handleOpenModal}
                                    className="relative w-full py-1 mt-2 rounded-[75px] overflow-hidden cursor-pointer"
                                >
                                    <img
                                        src={orderBg}
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="relative z-10 flex items-center justify-between px-6">
                                        <div className='flex items-start justify-start flex-col'>
                                            <span className="text-[#F7D5A0] text-base sm:text-lg font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                                Total
                                            </span>
                                            <span className="text-[#F7D5A0] text-lg sm:text-2xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                                ${calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[#F7D5A0] text-base sm:text-lg font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                                Place Order
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
                deliveryMethod={selectedDeliveryMethod}
                total={calculateTotal()}
                loading={orderLoading}
            />
        </div>
    )
}

export default CartPage