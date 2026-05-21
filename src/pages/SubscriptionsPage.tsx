import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { beanApi } from '@/services/beanService';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import { getImageUrl } from '@/utils/imageUrl';

type PlanType = 'weekly' | 'biweekly' | 'monthly';

interface Bean {
  id: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  imageUrl: string | null;
  grindOptions: { id: string; grind: string }[];
}

const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createSubscription, loading } = useSubscriptions(false);

  const [beans, setBeans] = useState<Bean[]>([]);
  const [selectedBean, setSelectedBean] = useState<Bean | null>(null);
  const [selectedGrind, setSelectedGrind] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('weekly');
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [pageLoading, setPageLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const beanId = queryParams.get('beanId');

  useEffect(() => {
    fetchBeans();
  }, []);

  useEffect(() => {
    if (beanId && beans.length > 0) {
      const bean = beans.find(b => b.id === beanId);
      if (bean) {
        setSelectedBean(bean);
        if (bean.grindOptions.length > 0) {
          setSelectedGrind(bean.grindOptions[0].id);
        }
        setStep('confirm');
      }
    }
  }, [beanId, beans]);

  const fetchBeans = async () => {
    setPageLoading(true);
    try {
      const res = await beanApi.getAll({ limit: 100 });
      const mappedBeans = (res.data?.data || []).map((bean: any) => ({
        ...bean,
        weight: String(bean.weight),
      }));
      setBeans(mappedBeans);
    } catch (error) {
      toast.error('Failed to load beans');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedBean) {
      toast.error('Please select a bean');
      return;
    }

    if (!selectedGrind) {
      toast.error('Please select a grind option');
      return;
    }

    let price = selectedBean.price;
    if (selectedPlan === 'weekly') price = selectedBean.price;
    else if (selectedPlan === 'biweekly') price = selectedBean.price * 2;
    else price = selectedBean.price * 4;

    const result = await createSubscription({
      beanId: selectedBean.id,
      grindOptionId: selectedGrind,
      deliveryPlan: selectedPlan,
      price: price,
    });

    if (result) {
      navigate('/my_subscription');
    }
  };

  const getPlanPrice = () => {
    if (!selectedBean) return 0;
    const price = Number(selectedBean.price);
    if (selectedPlan === 'weekly') return price;
    if (selectedPlan === 'biweekly') return price * 2;
    return price * 4;
  };

  const getPlanLabel = () => {
    switch (selectedPlan) {
      case 'weekly': return 'Every week';
      case 'biweekly': return 'Every 2 weeks';
      case 'monthly': return 'Every month';
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto  md:mb-20">
            {/* Header Section */}
            <div className="my-8">

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscribe to Coffee Beans</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Choose a bean to get regular deliveries</p>
            </div>

            {/* Beans Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {beans.map((bean) => (
                <div
                  key={bean.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedBean(bean);
                    if (bean.grindOptions.length > 0) {
                      setSelectedGrind(bean.grindOptions[0].id);
                    }
                    setStep('confirm');
                  }}
                >
                  <div className="h-40 sm:h-48 bg-amber-50 flex items-center justify-center">
                    {bean.imageUrl ? (
                      <img
                        src={getImageUrl(bean.imageUrl)}
                        alt={bean.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-amber-500 text-5xl sm:text-6xl">☕</div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1">{bean.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{bean.origin}</p>
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900">${bean.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500">per bag</span>
                    </div>
                    <button className="mt-4 w-full py-2 text-sm sm:text-base bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Confirm subscription step - Responsive
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto md:mb-20">
          <div className="my-8">
            <button
              onClick={() => setStep('select')}
              className="text-sm text-amber-600 hover:text-amber-700 mb-3 sm:mb-4 inline-block"
            >
              ← Back to Beans
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Confirm Subscription</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Review your subscription details</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-7xl mx-auto">
            <div className="p-4 sm:p-6">
              {/* Bean Info - Responsive flex */}
              <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-amber-50 flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                  {selectedBean?.imageUrl ? (
                    <img src={getImageUrl(selectedBean.imageUrl)} alt={selectedBean.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl">☕</span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedBean?.name}</h2>
                  <p className="text-sm text-gray-500">{selectedBean?.origin} · {selectedBean?.weight}</p>
                </div>
              </div>

              {/* Grind Option */}
              <div className="py-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grind Option</label>
                <select
                  value={selectedGrind}
                  onChange={(e) => setSelectedGrind(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                >
                  {selectedBean?.grindOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.grind.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Plan - Responsive grid */}
              <div className="py-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Plan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {(['weekly', 'biweekly', 'monthly'] as PlanType[]).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg border text-center transition-colors ${selectedPlan === plan
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:border-amber-300'
                        }`}
                    >
                      <div className="font-medium text-sm sm:text-base capitalize">{plan}</div>
                      <div className="text-xs mt-0.5 sm:mt-1">
                        {plan === 'weekly' && 'Every week'}
                        {plan === 'biweekly' && 'Every 2 weeks'}
                        {plan === 'monthly' && 'Every month'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Bean price</span>
                    <span>${Number(selectedBean?.price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Delivery plan</span>
                    <span className="capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total per delivery</span>
                    <span>${getPlanPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('select')}
                className="order-2 sm:order-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors sm:flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="order-1 sm:order-2 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 sm:flex-1"
              >
                {loading ? 'Processing...' : 'Confirm Subscription'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;