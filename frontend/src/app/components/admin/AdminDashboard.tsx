import { motion } from 'motion/react';
import { ShoppingCart, TrendingUp, Truck, Users } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { KPICard } from './KPICard';
import { useAdmin } from '../../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';

const weeklyRevenueData = [
  { day: 'Mon', revenue: 12500 },
  { day: 'Tue', revenue: 15200 },
  { day: 'Wed', revenue: 18900 },
  { day: 'Thu', revenue: 14300 },
  { day: 'Fri', revenue: 21500 },
  { day: 'Sat', revenue: 25800 },
  { day: 'Sun', revenue: 22400 },
];

const ordersPerDayData = [
  { day: 'Mon', orders: 45 },
  { day: 'Tue', orders: 52 },
  { day: 'Wed', orders: 68 },
  { day: 'Thu', orders: 49 },
  { day: 'Fri', orders: 78 },
  { day: 'Sat', orders: 89 },
  { day: 'Sun', orders: 72 },
];

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'out-for-delivery': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function AdminDashboard() {
  const { dashboardStats, orders, products } = useAdmin();
  const navigate = useNavigate();

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  // Get top products by revenue
  const topProducts = [...products]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Dashboard" />

      <div className="p-6 lg:p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Orders Today"
            value={dashboardStats.ordersToday}
            icon={ShoppingCart}
            trend={{ value: 12, isPositive: true }}
            delay={0.1}
          />
          <KPICard
            title="Revenue Today"
            value={`Rs. ${dashboardStats.revenueToday.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />
          <KPICard
            title="Active Deliveries"
            value={dashboardStats.activeDeliveries}
            icon={Truck}
            delay={0.3}
          />
          <KPICard
            title="New Customers"
            value={dashboardStats.newCustomers}
            icon={Users}
            trend={{ value: 15, isPositive: true }}
            delay={0.4}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Revenue Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Weekly Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#colorGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 4 }}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders Per Day Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Orders Per Day (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ordersPerDayData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="orders" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section: Recent Orders and Popular Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                  className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
                >
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
                          <Badge className={`text-xs ${statusColors[order.status]}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {order.items.length} item(s) • {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 dark:text-orange-500">
                          Rs. {order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Most Popular Products */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Most Popular Products</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/products')}
                  className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
                >
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.orderCount} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 dark:text-orange-500">
                          Rs. {(product.revenue || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
