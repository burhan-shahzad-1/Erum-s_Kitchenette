import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Award } from 'lucide-react';
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

const revenueData = [
  { date: 'Mar 8', revenue: 15500 },
  { date: 'Mar 9', revenue: 18200 },
  { date: 'Mar 10', revenue: 21900 },
  { date: 'Mar 11', revenue: 19300 },
  { date: 'Mar 12', revenue: 25500 },
  { date: 'Mar 13', revenue: 28800 },
  { date: 'Mar 14', revenue: 26400 },
  { date: 'Mar 15', revenue: 22100 },
];

const categoryData = [
  { category: 'Main Dishes', orders: 245, revenue: 110250 },
  { category: 'Desserts', orders: 189, revenue: 33930 },
  { category: 'Appetizers', orders: 156, revenue: 31200 },
  { category: 'Beverages', orders: 201, revenue: 20100 },
  { category: 'Snacks', orders: 134, revenue: 20100 },
];

const COLORS = ['#f97316', '#dc2626', '#ea580c', '#fb923c', '#fdba74'];

export function ReportsPage() {
  const { products, orders } = useAdmin();
  const [dateRange, setDateRange] = useState('week');

  // Calculate total metrics
  const totalRevenue = categoryData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = categoryData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  // Get top products
  const topProducts = [...products]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 10);

  const topCategory = categoryData.reduce((max, item) =>
    item.revenue > max.revenue ? item : max
  );

  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

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

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Revenue"
            value={`Rs. ${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
            delay={0.1}
          />
          <KPICard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingCart}
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />
          <KPICard
            title="Avg. Order Value"
            value={`Rs. ${Math.round(averageOrderValue)}`}
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
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
