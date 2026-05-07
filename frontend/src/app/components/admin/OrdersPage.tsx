import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Check, X } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { OrderDetailDrawer } from './OrderDetailDrawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'out-for-delivery': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};


export function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'rejected'>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const STATUS_PRIORITY: Record<string, number> = {
    pending: 0,
    preparing: 1,
    ready: 2,
    'out-for-delivery': 3,
    delivered: 4,
    rejected: 5,
  };

  const statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Preparing', value: 'preparing' },
    { label: 'Ready', value: 'ready' },
    { label: 'Out for Delivery', value: 'out-for-delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Rejected', value: 'rejected' },
  ] as const;

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const pa = STATUS_PRIORITY[a.status] ?? 99;
      const pb = STATUS_PRIORITY[b.status] ?? 99;
      if (pa !== pb) return pa - pb;
      // Within same status: newest first
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleAcceptOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderStatus(orderId, 'preparing');
    toast.success('Order accepted and moved to preparing!');
  };

  const handleRejectOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderStatus(orderId, 'rejected');
    toast.error('Order rejected');
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status as any);
    toast.success(`Order status updated to ${status}!`);
  };


  return (
    <div className="min-h-screen">
      <AdminNavbar title="Order Management" />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className={
                statusFilter === tab.value
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white whitespace-nowrap'
                  : 'whitespace-nowrap'
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No orders have been placed yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="border-2 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Order ID and Status */}
                      <div className="lg:col-span-3">
                        <div className="font-mono font-bold text-gray-900 dark:text-white mb-2">
                          {order.id}
                        </div>
                        <Badge className={statusColors[order.status as keyof typeof statusColors] ?? 'bg-gray-100 text-gray-700'}>
                          {order.status.replace(/-/g, ' ')}
                        </Badge>
                      </div>

                      {/* Customer Info */}
                      <div className="lg:col-span-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} item(s)
                        </p>
                      </div>

                      {/* Items Summary */}
                      <div className="lg:col-span-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </p>
                      </div>

                      {/* Total Amount */}
                      <div className="lg:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="font-bold text-lg text-orange-600 dark:text-orange-500">
                          Rs. {order.total.toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {order.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={(e) => handleAcceptOrder(order.id, e)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleRejectOrder(order.id, e)}
                              className="text-red-600 hover:text-red-700 dark:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : order.status !== 'delivered' && order.status !== 'rejected' ? (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready for Pickup</SelectItem>
                              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={statusColors[order.status as keyof typeof statusColors] ?? 'bg-gray-100 text-gray-700'}>
                            {order.status.replace(/-/g, ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Placed on {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
