import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, LogOut, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { EditProfileDialog } from './EditProfileDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import {
  NotificationPreferencesDialog,
  PrivacySettingsDialog,
  DietaryPreferencesDialog,
  SavedAddressesDialog,
  PaymentMethodsDialog,
} from './SettingsDialogs';
import { toast } from 'sonner';

interface Order {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: string;
}

const defaultOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2026-03-05',
    items: ['Chicken Biryani', 'Gulab Jamun'],
    total: 398,
    status: 'Delivered',
  },
  {
    id: 'ORD-002',
    date: '2026-03-03',
    items: ['Paneer Tikka Masala', 'Dal Makhani'],
    total: 438,
    status: 'Out for Delivery',
  },
  {
    id: 'ORD-003',
    date: '2026-03-01',
    items: ['Samosa (6 pcs)', 'Aloo Tikki Chaat'],
    total: 259,
    status: 'Delivered',
  },
];

const mockFavorites = [
  {
    id: '1',
    name: 'Chicken Biryani',
    price: 299,
    timesOrdered: 5,
  },
  {
    id: '3',
    name: 'Samosa (6 pcs)',
    price: 120,
    timesOrdered: 8,
  },
  {
    id: '2',
    name: 'Paneer Tikka Masala',
    price: 249,
    timesOrdered: 3,
  },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDietary, setShowDietary] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Sign in to view your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Access orders, favorites, and account settings after you sign in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Out for Delivery':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-orange-100">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-orange-100">
                  {user.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-orange-200 to-red-200 text-orange-700 text-2xl font-semibold">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.phone}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowEditProfile(true)}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-orange-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{mockFavorites.length}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">Rs. 3200</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                Order {order.id}
                              </h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items.join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-orange-600">
                                Rs. {order.total}
                              </div>
                            </div>
                            {order.status !== 'Delivered' ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate(`/order-tracking/${order.id}`)}
                                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                              >
                                Track Order
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockFavorites.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Ordered {item.timesOrdered} times
                            </p>
                          </div>
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-orange-600">
                            Rs. {item.price}
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                            Order Again
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900 mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900 mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900 mt-1">{user.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900 mt-1">{user.address}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowEditProfile(true)}
                    className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Information
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-4">
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowChangePassword(true)}
                        className="w-full justify-start"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNotifications(true)}
                        className="w-full justify-start"
                      >
                        Notification Preferences
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPrivacy(true)}
                        className="w-full justify-start"
                      >
                        Privacy Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDietary(true)}
                        className="w-full justify-start"
                      >
                        Dietary Preferences
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddresses(true)}
                        className="w-full justify-start"
                      >
                        Saved Addresses
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPayment(true)}
                        className="w-full justify-start"
                      >
                        Payment Methods
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-red-100">
                  <CardContent className="p-6">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <EditProfileDialog isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <ChangePasswordDialog isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <NotificationPreferencesDialog isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <PrivacySettingsDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <DietaryPreferencesDialog isOpen={showDietary} onClose={() => setShowDietary(false)} />
      <SavedAddressesDialog isOpen={showAddresses} onClose={() => setShowAddresses(false)} />
      <PaymentMethodsDialog isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
}