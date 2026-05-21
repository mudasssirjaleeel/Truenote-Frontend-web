import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useAddress } from '@/hooks/useAddress'
import toast from 'react-hot-toast'

import delete_icon from '../../assets/images/remove_icon.svg'
import edit_icon from '../../assets/images/edit_icon.svg'


// ── Types ─────────────────────────────────────────────────────────────────────
interface AddressDisplay {
  id: string
  label: string
  address: string
  isDefault: boolean
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#474653" />
    <path d="M19 10l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v10M1 6h10" stroke="#E2C4A7" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── Address Card ──────────────────────────────────────────────────────────────
const AddressCard = ({ item, onEdit, onDelete, onSetDefault }: {
  item: AddressDisplay
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}) => (
  <div className="flex flex-col gap-2">
    {/* label row */}
    <div className="flex items-center justify-between px-4">
      <span className="text-[#333] text-base font-normal" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {item.label}
      </span>
      {item.isDefault && (
        <span className="text-[#333] text-base font-normal" style={{ fontFamily: "'League Spartan', sans-serif" }}>
          Deliver Here (Primary)
        </span>
      )}
    </div>

    {/* address card */}
    <div
      className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl"
      style={{ background: '#F6DDC5' }}
    >
      <span
        className="text-base font-medium leading-4 flex-1 min-w-0"
        style={{ fontFamily: "'League Spartan', sans-serif", color: 'rgba(51,51,51,0.80)' }}
      >
        {item.address}
      </span>

      {/* edit + delete + set default */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {!item.isDefault && (
          <button
            onClick={() => onSetDefault(item.id)}
            className="text-xs text-[#474653] hover:opacity-70 transition-opacity px-2 py-1 rounded-lg bg-white/20"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Set Default
          </button>
        )}
        <button onClick={() => onEdit(item.id)} className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
          <img src={edit_icon} alt="Edit" />
        </button>
        <button onClick={() => onDelete(item.id)} className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
          <img src={delete_icon} alt="Delete" />
        </button>
      </div>
    </div>
  </div>
)

// ── Add/Edit Address Modal ─────────────────────────────────────────────────────
const AddressModal = ({ open, onClose, onSave, initialData }: {
  open: boolean
  onClose: () => void
  onSave: (data: { label: string; street: string; city: string; postalCode: string; isDefault: boolean }) => void
  initialData?: { id: string; label: string; street: string; city: string; postalCode: string; isDefault: boolean }
}) => {
  const [label, setLabel] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label)
      setStreet(initialData.street)
      setCity(initialData.city)
      setPostalCode(initialData.postalCode)
      setIsDefault(initialData.isDefault)
    } else {
      setLabel('')
      setStreet('')
      setCity('')
      setPostalCode('')
      setIsDefault(false)
    }
  }, [initialData, open])

  if (!open) return null

  const inputCls = "w-full px-4 py-3 outline outline-1 outline-[rgba(71,70,83,0.40)] bg-transparent text-[#333] placeholder-[rgba(51,51,51,0.40)] text-base font-medium focus:outline-[#474653] transition-all rounded-lg"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-[#F6DDC5] rounded-2xl w-full max-w-[480px] p-6 flex flex-col gap-5 shadow-xl">
        <h3 className="text-[#474653] text-xl font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>Label (e.g. Home, Work)</label>
            <input type="text" className={inputCls} value={label} onChange={e => setLabel(e.target.value)} placeholder="Home" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>Street Address</label>
            <input type="text" className={inputCls} value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main Street" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>City</label>
            <input type="text" className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="Toronto" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>Postal Code</label>
            <input type="text" className={inputCls} value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="M5H 3T4" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={e => setIsDefault(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>
              Set as default address
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl outline outline-1 outline-[#474653] text-[#474653] font-semibold"
            style={{ fontFamily: "'League Spartan', sans-serif" }}>Cancel</button>
          <button onClick={() => { if (label && street && city) { onSave({ label, street, city, postalCode, isDefault }); onClose() } }}
            className="flex-1 py-3 rounded-xl bg-[#474653] text-white font-semibold"
            style={{ fontFamily: "'League Spartan', sans-serif" }}>{initialData ? 'Update' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2].map((i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="h-5 bg-[#D5B89D] rounded w-24 animate-pulse mx-4" />
        <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F6DDC5] animate-pulse">
          <div className="flex-1 h-6 bg-[#D5B89D] rounded" />
          <div className="w-6 h-6 bg-[#D5B89D] rounded" />
          <div className="w-6 h-6 bg-[#D5B89D] rounded" />
        </div>
      </div>
    ))}
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const SavedAddressPage = () => {
  const navigate = useNavigate()
  const { addresses, loading, addAddress, updateAddress, deleteAddress, formatAddress, getAddresses } = useAddress()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  useEffect(() => {
    getAddresses()
  }, [])

  const handleEdit = (id: string) => {
    const address = addresses.find(a => a.id === id)
    if (address) {
      setEditingAddress(address)
      setModalOpen(true)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteAddress(id)
  }

  const handleSetDefault = async (id: string) => {
    await updateAddress(id, { isDefault: true })
  }

  const handleSave = async (data: { label: string; street: string; city: string; postalCode: string; isDefault: boolean }) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data)
    } else {
      await addAddress(data)
    }
    setEditingAddress(null)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingAddress(null)
  }

  const addressList: AddressDisplay[] = addresses.map(addr => ({
    id: addr.id,
    label: addr.label,
    address: formatAddress(addr),
    isDefault: addr.isDefault,
  }))

  const showLoadingSkeleton = loading && addresses.length === 0

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E2C4A7]">
      {/* side white glows */}
      <div className="absolute z-0 pointer-events-none hidden sm:block"
        style={{ width: 309, height: 933, left: -175, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />
      <div className="absolute z-0 pointer-events-none hidden sm:block"
        style={{ width: 309, height: 933, left: 'auto', right: -175, top: 230, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, filter: 'blur(216px)' }} />


      {/* ── Content ── */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-[80px] pt-[120px] sm:pt-[150px] lg:pt-[166px] pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4 md:gap-6 lg:gap-8">

          <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 md:mt-8">
            <div>
              <div className='md:flex md:gap-3 md:items-center md:justify-start'>
                <button onClick={() => navigate(-1)} className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1">
                  <BackArrow />
                </button>
                <h1 className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Saved Addresses
                </h1>
              </div>
              <p className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Manage your delivery locations for faster checkout.
              </p>
            </div>
          </div>

          {/* ── Address list ── */}
          {showLoadingSkeleton ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex flex-col gap-8">
              {addressList.map(item => (
                <AddressCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}

          {/* ── Add New Address button ── */}
          <div
            className="w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: '#F6DDC5' }}
            onClick={() => setModalOpen(true)}
          >
            <span
              className="text-[#333] text-base font-semibold"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Add New Address
            </span>
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: '#474653', borderRadius: 12 }}
            >
              <PlusIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ── Address Modal ── */}
      <AddressModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingAddress}
      />
    </div>
  )
}

export default SavedAddressPage