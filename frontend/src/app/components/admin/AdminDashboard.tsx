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

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildLast7Days(orders: { timestamp: string; total: number; status: string }[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    const dayOrders = orders.filter((o) => {
      const t = new Date(o.timestamp);
      return t >= date && t < next && o.status !== 'rejected';
    });

    return {
      day: DAY_NAMES[date.getDay()],
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });
}

const statusColors = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'out-for-delivery': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function pctChange(current: number, previous: number): { value: number; isPositive: boolean } | undefined {
  if (previous === 0) return undefined;
  const delta = Math.round(((current - previous) / previous) * 100);
  return { value: Math.abs(delta), isPositive: delta >= 0 };
}

export function AdminDashboard() {
  const { dashboardStats, orders, products } = useAdmin();
  const navigate = useNavigate();

  const last7Days = buildLast7Days(orders);
  const recentOrders = [...orders].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  // Compute this-week vs last-week metrics for real trend arrows
  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfToday.getDate() - 1);
  const startOfThisWeek = new Date(startOfToday); startOfThisWeek.setDate(startOfToday.getDate() - 6);
  const startOfLastWeek = new Date(startOfThisWeek); startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const inRange = (ts: string, from: Date, to: Date) => { const t = new Date(ts); return t >= from && t < to; };
  const active = orders.filter((o) => o.status !== 'rejected');

  const ordersToday = active.filter((o) => inRange(o.timestamp, startOfToday, now)).length;
  const ordersYesterday = active.filter((o) => inRange(o.timestamp, startOfYesterday, startOfToday)).length;

  const revenueThisWeek = active.filter((o) => inRange(o.timestamp, startOfThisWeek, now)).reduce((s, o) => s + o.total, 0);
  const revenueLastWeek = active.filter((o) => inRange(o.timestamp, startOfLastWeek, startOfThisWeek)).reduce((s, o) => s + o.total, 0);

  // Compute per-product order count and revenue from real orders
  const productStatsMap = new Map<string, { orderCount: number; revenue: number }>();
  orders.forEach((order) => {
    if (order.status === 'rejected') return;
    order.items.forEach((item) => {
      const existing = productStatsMap.get(item.foodItemId) ?? { orderCount: 0, revenue: 0 };
      productStatsMap.set(item.foodItemId, {
        orderCount: existing.orderCount + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      });
    });
  });

  const topProducts = [...products]
    .map((p) => ({ ...p, ...(productStatsMap.get(p.id) ?? { orderCount: 0, revenue: 0 }) }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Dashboard" />

      <div className="p-6 lg:p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Orders Today"
            value={ordersToday}
            icon={ShoppingCart}
            trend={pctChange(ordersToday, ordersYesterday)}
            delay={0.1}
          />
          <KPICard
            title="Revenue This Week"
            value={`Rs. ${revenueThisWeek.toLocaleString()}`}
            icon={TrendingUp}
            trend={pctChange(revenueThisWeek, revenueLastWeek)}
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
                  <LineChart data={last7Days}>
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
                  <BarChart data={last7Days}>
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
