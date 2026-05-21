import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { getImageUrl } from '@/utils/imageUrl';
import {
    Pause,
    Play,
    SkipForward,
    Trash2,
    Coffee,
    Calendar,
    DollarSign,
    AlertCircle
} from 'lucide-react';

// ── Back Arrow ────────────────────────────────────────────────────────────────
const BackArrow = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#474653" />
        <path d="M19 10l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

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
                </div>
            </div>
        ))}
    </div>
);

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#474653" fillOpacity="0.3" stroke="#474653" strokeWidth="1.5" />
            </svg>
            <p className="text-[#474653] text-xl font-medium text-center" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                No active subscriptions.
            </p>
            <button
                onClick={() => navigate('/coffee_beans')}
                className="px-6 py-3 bg-[#474653] text-[#F7D5A0] rounded-full hover:bg-[#5a5a6b] transition-colors"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
                Browse Coffee Beans
            </button>
        </div>
    )
};

// ── Subscription Card ────────────────────────────────────────────────────────
const SubscriptionCard = ({ sub, onPause, onResume, onSkip, onCancel, actionLoading }: any) => {


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getPlanLabel = (plan: string) => {
        switch (plan) {
            case 'weekly': return 'Every week';
            case 'biweekly': return 'Every 2 weeks';
            case 'monthly': return 'Every month';
            default: return plan;
        }
    };

    return (
        <div
            className="w-full flex flex-col gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02]"
            style={{ background: '#F6DDC5' }}
        >
            {/* Product Info Row */}
            <div className="flex gap-3 sm:gap-4">
                {/* Image */}
                <div className="w-[50px] h-[65px] sm:w-[62px] sm:h-[78px] rounded-lg bg-amber-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {sub.image_url ? (
                        <img
                            src={getImageUrl(sub.image_url)}
                            alt={sub.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                            }}
                        />
                    ) : (
                        <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <h3 className="text-[#333] text-sm sm:text-base font-medium" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                {sub.product_name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {sub.origin && (
                                    <span className="text-xs text-[#474653]/70" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        Origin: {sub.origin}
                                    </span>
                                )}
                                {sub.weight && (
                                    <span className="text-xs text-[#474653]/70" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        {sub.weight}
                                    </span>
                                )}
                                {sub.grind && (
                                    <span className="text-xs text-[#474653]/70" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                        Grind: {sub.grind.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                            <div className="flex items-center gap-1 text-xl sm:text-2xl font-bold text-[#474653]" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                                {sub.price}
                            </div>
                            <p className="text-xs text-[#474653]/50">per delivery</p>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#474653]/70">
                            <Calendar className="w-3 h-3" />
                            <span>{getPlanLabel(sub.delivery_plan)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#474653]/70">
                            <AlertCircle className="w-3 h-3" />
                            <span>Next: {formatDate(sub.next_delivery)}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {sub.is_paused && (
                        <div className="mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Paused
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[rgba(0,0,0,0.1)]">
                        <button
                            onClick={() => sub.is_paused ? onResume(sub.id) : onPause(sub.id)}
                            disabled={actionLoading === sub.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${sub.is_paused
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-[#474653] text-[#E2C4A7] hover:bg-[#5a5a6b]'
                                } disabled:opacity-50`}
                        >
                            {sub.is_paused ? (
                                <><Play className="w-3 h-3" /> Resume</>
                            ) : (
                                <><Pause className="w-3 h-3" /> Pause</>
                            )}
                        </button>

                        <button
                            onClick={() => onSkip(sub.id)}
                            disabled={actionLoading === sub.id || sub.is_paused}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#474653] text-[#E2C4A7] rounded-lg hover:bg-[#5a5a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            <SkipForward className="w-3 h-3" /> Skip Next
                        </button>

                        <button
                            onClick={() => onCancel(sub.id)}
                            disabled={actionLoading === sub.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm"
                        >
                            <Trash2 className="w-3 h-3" /> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MySubscriptionPage = () => {
    const navigate = useNavigate();
    const { subscriptions, loading, pauseSubscription, resumeSubscription, skipDelivery, cancelSubscription, refresh } = useSubscriptions();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelId, setCancelId] = useState<string | null>(null);

    const handlePause = async (id: string) => {
        setActionLoading(id);
        await pauseSubscription(id);
        setActionLoading(null);
        refresh();
    };

    const handleResume = async (id: string) => {
        setActionLoading(id);
        await resumeSubscription(id);
        setActionLoading(null);
        refresh();
    };

    const handleSkip = async (id: string) => {
        setActionLoading(id);
        await skipDelivery(id);
        setActionLoading(null);
        refresh();
    };

    const handleCancelClick = (id: string) => {
        setCancelId(id);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancelId) return;
        setActionLoading(cancelId);
        await cancelSubscription(cancelId);
        setActionLoading(null);
        setShowCancelModal(false);
        setCancelId(null);
        refresh();
    };

    const handleCancelModalClose = () => {
        setShowCancelModal(false);
        setCancelId(null);
    };

    const showLoadingSkeleton = loading && subscriptions.length === 0;

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

                    {/* Header */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-4 lg:mb-8 md:mt-8">
                        <div>
                            <div className='md:flex md:gap-3 md:items-center md:justify-start'>
                                <button onClick={() => navigate(-1)} className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer mt-1">
                                    <BackArrow />
                                </button>
                                <h1 className="text-[#474653] text-[30px] md:text-[35px] lg:text-[40px] 2xl:text-[50px] font-bold" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                    My Subscriptions
                                </h1>
                            </div>
                            <p className="text-[#474653] text-[16px] md:text-[20px] lg:text-[24px] 2xl:text-[30px] font-semibold mt-1 sm:mt-2 md:pl-8 lg:pl-12" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                Manage your coffee bean subscriptions
                            </p>
                        </div>
                    </div>

                    {/* Subscriptions List */}
                    {showLoadingSkeleton ? (
                        <LoadingSkeleton />
                    ) : subscriptions.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {subscriptions.map((sub: any) => (
                                <SubscriptionCard
                                    key={sub.id}
                                    sub={sub}
                                    onPause={handlePause}
                                    onResume={handleResume}
                                    onSkip={handleSkip}
                                    onCancel={handleCancelClick}
                                    actionLoading={actionLoading}
                                />
                            ))}
                        </div>
                    )}

                    {/* Subscription count badge */}
                    {subscriptions.length > 0 && (
                        <div className="flex justify-end mt-2">
                            <span
                                className="text-sm text-[#474653]/60"
                                style={{ fontFamily: "'League Spartan', sans-serif" }}
                            >
                                {subscriptions.length} {subscriptions.length === 1 ? 'active subscription' : 'active subscriptions'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                Cancel Subscription?
                            </h3>
                            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                                Are you sure you want to cancel this subscription? You will no longer receive deliveries and your subscription will be permanently cancelled.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelModalClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={handleCancelConfirm}
                                    disabled={actionLoading === cancelId}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                                >
                                    {actionLoading === cancelId ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySubscriptionPage;