import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, LogOut, Edit, ShoppingCart, MapPin, Plus, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { foodApi, ordersApi } from '../lib/api';
import { ImageWithFallback } from './ImageWithFallback';
import { useNavigate, Link } from 'react-router';
import { EditProfileDialog } from './EditProfileDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { toast } from 'sonner';

interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  city: string;
  phone: string;
}

function loadAddresses(userId: string): SavedAddress[] {
  try {
    return JSON.parse(localStorage.getItem(`addresses_${userId}`) ?? '[]');
  } catch { return []; }
}

function saveAddresses(userId: string, addresses: SavedAddress[]) {
  localStorage.setItem(`addresses_${userId}`, JSON.stringify(addresses));
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop';

interface FavProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  createdAt: string;
  items: { title: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
}

export function Profile() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', city: 'Lahore', phone: '' });
  const [allProducts, setAllProducts] = useState<FavProduct[]>([]);

  useEffect(() => {
    foodApi.getAll()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: FavProduct[] = (res.data.data as any[]).map((item: any) => ({
          id: item.id,
          name: item.title,
          price: item.price,
          image: item.imageUrl || FALLBACK_IMAGE,
          category: item.category,
        }));
        setAllProducts(items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setOrdersLoading(true);
    ordersApi.getAll()
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: any[] = res.data.data ?? [];
        const mapped: Order[] = raw
          .map((o) => ({
            id: o.id,
            createdAt: o.createdAt,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: (o.items ?? []).map((i: any) => ({
              title: i.title ?? i.name ?? 'Item',
              quantity: i.quantity,
              price: i.price,
            })),
            totalAmount: o.totalAmount,
            status: o.status,
            deliveryAddress: o.deliveryAddress,
          }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(mapped);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    if (user?.id) setAddresses(loadAddresses(user.id));
  }, [user?.id]);

  const addAddress = () => {
    if (!newAddr.label || !newAddr.line1 || !newAddr.phone) {
      toast.error('Please fill in all address fields.');
      return;
    }
    const updated = [...addresses, { ...newAddr, id: Date.now().toString() }];
    setAddresses(updated);
    saveAddresses(user!.id, updated);
    setNewAddr({ label: '', line1: '', city: 'Lahore', phone: '' });
    setShowAddressForm(false);
    toast.success('Address saved!');
  };

  const removeAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveAddresses(user!.id, updated);
  };

  const favoriteProducts = allProducts.filter((p) => favorites.has(p.id));

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
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'preparing':
      case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ready': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready for Pickup',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] ?? status;
  };

  const totalSpent = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

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
              <div className="text-2xl font-bold text-orange-600">{favorites.size}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">Rs. {totalSpent.toLocaleString()}</div>
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
              {ordersLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Place your first order to see it here.</p>
                  <Button
                    onClick={() => navigate('/menu')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-orange-100 hover:shadow-lg transition-shadow dark:border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate max-w-[140px]">
                                  #{order.id.slice(-8).toUpperCase()}
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {order.items.map((i) => `${i.title} ×${i.quantity}`).join(', ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <div className="text-lg font-bold text-orange-600 dark:text-orange-500">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </div>
                              </div>
                              {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                                >
                                  Track Order
                                </Button>
                              ) : (
                                <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No favourites yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Tap the heart icon on any dish to save it here.
                  </p>
                  <Button
                    onClick={() => navigate('/menu')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-orange-100 hover:shadow-lg transition-shadow overflow-hidden">
                        <Link to={`/product/${item.id}`}>
                          <div className="h-40 overflow-hidden">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 pr-2">
                              <Link to={`/product/${item.id}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-orange-600 transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                            </div>
                            <button
                              onClick={() => toggleFavorite(item.id)}
                              className="shrink-0 text-red-500 hover:text-red-700 transition-colors"
                              aria-label="Remove from favourites"
                            >
                              <Heart className="w-5 h-5 fill-red-500" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-orange-600 dark:text-orange-500">
                              Rs. {item.price}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
                                toast.success(`${item.name} added to cart!`);
                              }}
                              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
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
                {/* Account */}
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePassword(true)}
                      className="w-full justify-start"
                    >
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Saved Addresses */}
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        Saved Addresses
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddressForm((v) => !v)}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-1" />}
                        {showAddressForm ? 'Cancel' : 'Add New'}
                      </Button>
                    </div>

                    {/* Add address form */}
                    {showAddressForm && (
                      <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl space-y-3 border border-orange-100 dark:border-orange-800">
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Label (e.g. Home, Work)</Label>
                          <Input
                            placeholder="Home"
                            value={newAddr.label}
                            onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Street Address</Label>
                          <Input
                            placeholder="House no., street, block"
                            value={newAddr.line1}
                            onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 dark:text-gray-400">City</Label>
                            <Input
                              placeholder="Lahore"
                              value={newAddr.city}
                              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 dark:text-gray-400">Phone</Label>
                            <Input
                              placeholder="+92 321 1234567"
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={addAddress}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                        >
                          Save Address
                        </Button>
                      </div>
                    )}

                    {addresses.length === 0 && !showAddressForm ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No saved addresses yet. Add one to speed up checkout.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="flex items-start justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{addr.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{addr.line1}, {addr.city}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{addr.phone}</p>
                            </div>
                            <button
                              onClick={() => removeAddress(addr.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-2 mt-0.5"
                              aria-label="Remove address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Log out */}
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
    </div>
  );
}