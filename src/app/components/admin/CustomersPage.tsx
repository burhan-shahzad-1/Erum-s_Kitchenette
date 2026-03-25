import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, User } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export function CustomersPage() {
  const { customers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'new' | 'frequent'>('all');

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
    </div>
  );
}
