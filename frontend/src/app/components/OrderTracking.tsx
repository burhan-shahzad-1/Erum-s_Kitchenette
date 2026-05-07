import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../lib/api';

type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

const BACKEND_TO_STEP: Record<string, OrderStatus> = {
  pending: 'placed',
  confirmed: 'confirmed',
  preparing: 'preparing',
  ready: 'out-for-delivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

interface OrderStep {
  id: OrderStatus;
  title: string;
  description: string;
  icon: React.ElementType;
}

const orderSteps: OrderStep[] = [
  { id: 'placed', title: 'Order Placed', description: 'Order received by the restaurant', icon: Package },
  { id: 'confirmed', title: 'Order Confirmed', description: 'Restaurant has accepted the order', icon: CheckCircle2 },
  { id: 'preparing', title: 'Preparing Your Food', description: 'Kitchen is preparing the order', icon: Clock },
  { id: 'out-for-delivery', title: 'Out for Delivery', description: 'Rider has picked up the order', icon: Truck },
  { id: 'delivered', title: 'Delivered', description: 'Order successfully delivered', icon: Check },
];

interface OrderData {
  id: string;
  status: OrderStatus;
  items: { title: string; quantity: number; price: number }[];
  totalAmount: number;
  deliveryAddress: string;
}


export function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await ordersApi.getOne(orderId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data.data as any;
      setOrder({
        id: data.id,
        status: BACKEND_TO_STEP[data.status] ?? 'placed',
        items: data.items,
        totalAmount: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
      });
      setError(null);
    } catch {
      setError('Could not load order details.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    // Poll every 30 seconds to pick up status updates from the admin
    const interval = setInterval(fetchOrder, 30_000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const currentStatus: OrderStatus = order?.status ?? 'placed';

  const estimatedTime = {
    placed: 45, confirmed: 40, preparing: 25, 'out-for-delivery': 10, delivered: 0, cancelled: 0,
  }[currentStatus] ?? 30;

  const getCurrentStepIndex = () => orderSteps.findIndex(s => s.id === currentStatus);
  const isStepCompleted = (stepId: OrderStatus) => {
    if (currentStatus === 'cancelled') return false;
    return orderSteps.findIndex(s => s.id === stepId) < getCurrentStepIndex();
  };
  const isStepActive = (stepId: OrderStatus) => stepId === currentStatus;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/profile')} className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Top Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="gap-2 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="font-bold text-lg lg:text-xl text-gray-900 dark:text-gray-100">Order Tracking</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{orderId || 'ORD-2024-1234'}</p>
          </div>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Two Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Map and Rider Info */}
          <div className="space-y-6">
            {/* Map View */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="relative h-64 lg:h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                  
                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    <motion.path
                      d="M 50 200 Q 150 100 250 50"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="10,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>

                  {/* Restaurant Pin */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute bottom-8 left-12 flex flex-col items-center"
                  >
                    <div className="bg-orange-600 text-white p-2 rounded-full shadow-lg">
                      <MapPin className="w-6 h-6 fill-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md mt-1 text-xs font-medium dark:text-gray-100">
                      Restaurant
                    </div>
                  </motion.div>

                  {/* Rider Pin (Animated) */}
                  {currentStatus === 'out-for-delivery' && (
                    <motion.div
                      initial={{ scale: 0, x: 50, y: 200 }}
                      animate={{ scale: 1, x: 200, y: 80 }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                      className="absolute flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-green-600 text-white p-2 rounded-full shadow-lg"
                      >
                        <Truck className="w-6 h-6" />
                      </motion.div>
                      <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md mt-1 text-xs font-medium dark:text-gray-100">
                        Rider
                      </div>
                    </motion.div>
                  )}

                  {/* Delivery Pin */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute top-8 right-12 flex flex-col items-center"
                  >
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                      <MapPin className="w-6 h-6 fill-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md mt-1 text-xs font-medium dark:text-gray-100">
                      Your Location
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Out-for-delivery notice */}
            {currentStatus === 'out-for-delivery' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-orange-200 dark:border-orange-900/50 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Your order is on its way!</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">A rider has picked up your order and is heading to your address.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column: Estimated Time, Order Progress, and Details */}
          <div className="space-y-6">
            {/* Estimated Time Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {currentStatus === 'cancelled' ? (
                <Card className="border-2 border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 shadow-lg">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <XCircle className="w-16 h-16 lg:w-20 lg:h-20 text-red-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-1">Order Cancelled</h2>
                    <p className="text-gray-600 dark:text-gray-300">This order was cancelled.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-orange-200 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <motion.div
                      animate={currentStatus !== 'delivered' ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-3 shadow-lg"
                    >
                      <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {currentStatus === 'delivered' ? 'Delivered!' : `${estimatedTime} mins`}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {currentStatus === 'delivered' ? 'Your order has been delivered' : 'Estimated Arrival Time'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Order Progress Stepper */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="font-bold text-lg lg:text-xl text-gray-900 dark:text-gray-100 mb-6">Order Status</h3>
                  
                  <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />

                    {orderSteps.map((step, index) => {
                      const completed = isStepCompleted(step.id);
                      const active = isStepActive(step.id);
                      const Icon = step.icon;

                      return (
                        <motion.div
                          key={step.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="relative flex items-start gap-4"
                        >
                          {/* Step Icon */}
                          <div className="relative z-10">
                            {completed ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                              </motion.div>
                            ) : active ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                              </motion.div>
                            ) : (
                              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                            
                            {/* Pulsing Ring for Active Step */}
                            {active && (
                              <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-orange-500 rounded-full"
                              />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pb-2">
                            <h4
                              className={`font-semibold lg:text-lg ${
                                active
                                  ? 'text-orange-600 dark:text-orange-500'
                                  : completed
                                  ? 'text-gray-900 dark:text-gray-100'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p
                              className={`text-sm lg:text-base ${
                                active || completed
                                  ? 'text-gray-600 dark:text-gray-300'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            >
                              {step.description}
                            </p>
                            {active && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-2 text-sm lg:text-base text-orange-600 dark:text-orange-500 font-medium"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full"
                                />
                                In Progress...
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Details Summary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="font-bold text-lg lg:text-xl text-gray-900 dark:text-gray-100 mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Order ID</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[180px] truncate">
                        #{order.id}
                      </span>
                    </div>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600 dark:text-gray-300">{item.title} × {item.quantity}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                      <span className="font-bold text-orange-600 dark:text-orange-500 text-base lg:text-lg">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Delivery Address</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[200px]">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}