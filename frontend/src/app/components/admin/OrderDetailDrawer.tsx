import { X, MapPin, CreditCard, User, Phone, Mail, Package, Clock, CheckCircle2, Truck, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'rejected';
  timestamp: string;
  deliveryAddress: string;
  paymentMethod: string;
}

interface OrderDetailDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusSteps = [
  { id: 'pending', label: 'Pending', icon: Package },
  { id: 'preparing', label: 'Preparing', icon: Clock },
  { id: 'ready', label: 'Ready', icon: CheckCircle2 },
  { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Check },
];

const statusColors = {
  pending: 'bg-orange-500',
  preparing: 'bg-blue-500',
  ready: 'bg-purple-500',
  'out-for-delivery': 'bg-yellow-500',
  delivered: 'bg-green-500',
  rejected: 'bg-red-500',
};

export function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailDrawerProps) {
  if (!order) return null;

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.id === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
            <span className="font-mono font-medium text-gray-900 dark:text-white">
              {order.id}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Timeline */}
          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Order Status</h3>
            <div className="relative space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800" />

              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                  <div key={step.id} className="relative flex items-center gap-4">
                    <div className="relative z-10">
                      {isCompleted ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : isActive ? (
                        <div className={`w-8 h-8 ${statusColors[order.status]} rounded-full flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        isActive || isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">+92 300 1234567</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity} × Rs. {item.price}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Rs. {item.quantity * item.price}
                  </p>
                </div>
              ))}

              {/* Total */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-orange-600 dark:text-orange-500">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900 dark:text-white">{order.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {new Date(order.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
