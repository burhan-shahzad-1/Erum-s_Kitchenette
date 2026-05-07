import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, User, X, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const statusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'out-for-delivery': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function CustomersPage() {
  const { customers, orders } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'new' | 'frequent'>('all');
  const [historyCustomerId, setHistoryCustomerId] = useState<string | null>(null);

  const historyCustomer = customers.find((c) => c.id === historyCustomerId) ?? null;
  const historyOrders = historyCustomerId
    ? [...orders]
        .filter((o) => o.customerId === historyCustomerId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  const getFilteredCustomers = () => {
    let filtered = customers;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
    }

    // Apply type filter
    if (filterType === 'new') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((c) => new Date(c.joinDate) >= weekAgo);
    } else if (filterType === 'frequent') {
      filtered = filtered.filter((c) => c.totalOrders >= 5);
    }

    return filtered;
  };

  const filteredCustomers = getFilteredCustomers();

  const filterTabs = [
    { label: 'All Customers', value: 'all' as const },
    { label: 'New (This Week)', value: 'new' as const },
    { label: 'Frequent Buyers', value: 'frequent' as const },
  ];

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Customer Management" />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={filterType === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(tab.value)}
              className={
                filterType === tab.value
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : ''
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Customers Grid */}
        {filteredCustomers.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No customers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Customer Header */}
                    <div className="flex items-start gap-4 mb-4">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 dark:border-orange-900"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                          {customer.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                          {customer.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {customer.totalOrders} orders
                          </Badge>
                          {new Date(customer.joinDate) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-white truncate">
                          {customer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                        <span className="text-gray-900 dark:text-white">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {customer.notes && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{customer.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        onClick={() => setHistoryCustomerId(customer.id)}
                      >
                        View Order History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order History Drawer */}
      {historyCustomerId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setHistoryCustomerId(null)}
        />
      )}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: historyCustomerId ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold">
              {historyCustomer?.name.charAt(0) ?? '?'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {historyCustomer?.name ?? 'Customer'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {historyOrders.length} order{historyOrders.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setHistoryCustomerId(null)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Customer contact info */}
        {historyCustomer && (historyCustomer.email || historyCustomer.phone) && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm flex-shrink-0">
            {historyCustomer.email && (
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">Email: </span>
                {historyCustomer.email}
              </span>
            )}
            {historyCustomer.phone && (
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">Phone: </span>
                {historyCustomer.phone}
              </span>
            )}
          </div>
        )}

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {historyOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                This customer hasn't placed any orders
              </p>
            </div>
          ) : (
            historyOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
              >
                {/* Order header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {order.id}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.timestamp).toLocaleString('en-PK', {
                        dateStyle: 'medium', timeStyle: 'short',
                      })}
                    </div>
                  </div>
                  <Badge className={`text-xs ${statusColors[order.status] ?? ''}`}>
                    {order.status.replace('-', ' ')}
                  </Badge>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 max-w-[60%]">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>
                  <span className="font-bold text-orange-600 dark:text-orange-500">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {historyOrders.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex-shrink-0">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total spent</span>
              <span className="font-bold text-gray-900 dark:text-white">
                Rs. {historyOrders
                  .filter((o) => o.status !== 'rejected')
                  .reduce((s, o) => s + o.total, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Completed orders</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {historyOrders.filter((o) => o.status === 'delivered').length} / {historyOrders.length}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
