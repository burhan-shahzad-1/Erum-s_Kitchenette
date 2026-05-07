import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Award } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { KPICard } from './KPICard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#f97316', '#dc2626', '#ea580c', '#fb923c', '#fdba74'];

const CATEGORY_LABELS: Record<string, string> = {
  main: 'Main Dishes', snack: 'Snacks', dessert: 'Desserts',
  beverage: 'Beverages', appetizer: 'Appetizers', other: 'Other',
};

export function ReportsPage() {
  const { products, orders } = useAdmin();
  const [dateRange, setDateRange] = useState('week');

  // Filter orders by selected date range (exclude cancelled)
  const activeOrders = orders.filter((o) => o.status !== 'rejected');
  const filteredOrders = activeOrders.filter((o) => {
    const t = new Date(o.timestamp);
    const now = new Date();
    if (dateRange === 'today') {
      return t.toDateString() === now.toDateString();
    }
    if (dateRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      weekAgo.setHours(0, 0, 0, 0);
      return t >= weekAgo;
    }
    if (dateRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 29);
      monthAgo.setHours(0, 0, 0, 0);
      return t >= monthAgo;
    }
    return true;
  });

  // Revenue trend — one data point per day in the range
  const days = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : 30;
  const revenueData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const dayOrders = activeOrders.filter((o) => {
      const t = new Date(o.timestamp);
      return t >= date && t < next;
    });
    const label = days <= 7
      ? date.toLocaleDateString('en-PK', { weekday: 'short' })
      : date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
    return { date: label, revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
  });

  // Category breakdown — match order items to products to get category
  const productCategoryMap = new Map(products.map((p) => [p.id, p.category]));
  const categoryMap = new Map<string, { orders: number; revenue: number }>();
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const rawCat = productCategoryMap.get(item.foodItemId) ?? 'other';
      const label = CATEGORY_LABELS[rawCat] ?? rawCat;
      const existing = categoryMap.get(label) ?? { orders: 0, revenue: 0 };
      categoryMap.set(label, {
        orders: existing.orders + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      });
    });
  });
  const categoryData = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products by order count
  const productStatsMap = new Map<string, { orderCount: number; revenue: number }>();
  filteredOrders.forEach((order) => {
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
    .slice(0, 10);

  // Summary KPIs
  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const topCategory = categoryData[0] ?? { category: '—', revenue: 0 };

  // Trends: compare current period to the same-length period before it
  const prevOrders = activeOrders.filter((o) => {
    const t = new Date(o.timestamp);
    const now2 = new Date();
    if (dateRange === 'today') {
      const yesterday = new Date(now2); yesterday.setDate(now2.getDate() - 1);
      const dayBefore = new Date(yesterday); dayBefore.setDate(yesterday.getDate() - 1);
      return t >= dayBefore && t < yesterday;
    }
    if (dateRange === 'week') {
      const twoWeeksAgo = new Date(now2); twoWeeksAgo.setDate(now2.getDate() - 13); twoWeeksAgo.setHours(0, 0, 0, 0);
      const weekAgo = new Date(now2); weekAgo.setDate(now2.getDate() - 6); weekAgo.setHours(0, 0, 0, 0);
      return t >= twoWeeksAgo && t < weekAgo;
    }
    const twoMonthsAgo = new Date(now2); twoMonthsAgo.setDate(now2.getDate() - 59); twoMonthsAgo.setHours(0, 0, 0, 0);
    const monthAgo = new Date(now2); monthAgo.setDate(now2.getDate() - 29); monthAgo.setHours(0, 0, 0, 0);
    return t >= twoMonthsAgo && t < monthAgo;
  });
  const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0);
  const prevCount = prevOrders.length;

  function pctChange(current: number, previous: number) {
    if (previous === 0) return undefined;
    const delta = Math.round(((current - previous) / previous) * 100);
    return { value: Math.abs(delta), isPositive: delta >= 0 };
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Sales & Reports" />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('today')}
              className={dateRange === 'today' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : ''}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('week')}
              className={dateRange === 'week' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : ''}
            >
              This Week
            </Button>
            <Button
              variant={dateRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('month')}
              className={dateRange === 'month' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : ''}
            >
              This Month
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Custom
            </Button>
          </div>

        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Revenue"
            value={`Rs. ${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={pctChange(totalRevenue, prevRevenue)}
            delay={0.1}
          />
          <KPICard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingCart}
            trend={pctChange(totalOrders, prevCount)}
            delay={0.2}
          />
          <KPICard
            title="Avg. Order Value"
            value={`Rs. ${Math.round(averageOrderValue)}`}
            icon={TrendingUp}
            delay={0.3}
          />
          <KPICard
            title="Top Category"
            value={topCategory.category}
            icon={Award}
            delay={0.4}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="date" className="text-xs" />
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

          {/* Orders by Category */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Orders by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="category" className="text-xs" angle={-45} textAnchor="end" height={80} />
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

        {/* Revenue Share Pie Chart and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Share by Category */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Revenue Share by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.category}: ${Math.round((entry.revenue / totalRevenue) * 100)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Most Popular Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.orderCount} orders
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
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
