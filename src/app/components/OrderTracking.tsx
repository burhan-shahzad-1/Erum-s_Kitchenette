import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, MessageCircle, MapPin, Check, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useState, useEffect } from 'react';

type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';

interface OrderStep {
  id: OrderStatus;
  title: string;
  description: string;
  icon: React.ElementType;
}

const orderSteps: OrderStep[] = [
  {
    id: 'placed',
    title: 'Order Placed',
    description: 'Order received by the restaurant',
    icon: Package,
  },
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    description: 'Restaurant has accepted the order',
    icon: CheckCircle2,
  },
  {
    id: 'preparing',
    title: 'Preparing Your Food',
    description: 'Kitchen is preparing the order',
    icon: Clock,
  },
  {
    id: 'out-for-delivery',
    title: 'Out for Delivery',
    description: 'Rider has picked up the order',
    icon: Truck,
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Order successfully delivered',
    icon: Check,
  },
];

interface RiderInfo {
  name: string;
  photo: string;
  rating: number;
  phone: string;
}

const mockRider: RiderInfo = {
  name: 'Ahmed Khan',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  rating: 4.8,
  phone: '+92 300 1234567',
};

export function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('preparing');
  const [estimatedTime, setEstimatedTime] = useState(20);

  // Simulate order progression
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStatus === 'placed') setCurrentStatus('confirmed');
      else if (currentStatus === 'confirmed') setCurrentStatus('preparing');
      else if (currentStatus === 'preparing') setCurrentStatus('out-for-delivery');
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentStatus]);

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.id === currentStatus);
  };

  const isStepCompleted = (stepId: OrderStatus) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = orderSteps.findIndex(step => step.id === stepId);
    return stepIndex < currentIndex;
  };

  const isStepActive = (stepId: OrderStatus) => {
    return stepId === currentStatus;
  };

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

            {/* Rider Info Card */}
            {currentStatus === 'out-for-delivery' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-orange-200 dark:border-orange-900/50 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={mockRider.photo}
                          alt={mockRider.name}
                          className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-orange-200 dark:border-orange-900"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg lg:text-xl">
                          {mockRider.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Your Delivery Rider</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(mockRider.rating)
                                    ? 'text-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                            {mockRider.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                        onClick={() => window.open(`tel:${mockRider.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-orange-300 dark:border-orange-900 text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
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
              <Card className="border-2 border-orange-200 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg">
                <CardContent className="p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-3 shadow-lg"
                  >
                    <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {estimatedTime} mins
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">Estimated Arrival Time</p>
                </CardContent>
              </Card>
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
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        #{orderId || 'ORD-2024-1234'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Items</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">3 items</span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                      <span className="font-bold text-orange-600 dark:text-orange-500 text-base lg:text-lg">Rs. 1,850</span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 dark:text-gray-300">Delivery Address</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[200px]">
                        Johar Town, Lahore
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