import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, CreditCard, Wallet, DollarSign, CheckCircle, BookUser } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Separator } from './ui/separator';
import { ordersApi, deliveryAreasApi } from '../lib/api';
import { toast } from 'sonner';

interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  city: string;
  phone: string;
}

function loadSavedAddresses(userId: string): SavedAddress[] {
  try {
    return JSON.parse(localStorage.getItem(`addresses_${userId}`) ?? '[]');
  } catch { return []; }
}

const DELIVERY_FEE = 100;

const FALLBACK_AREAS = ['Johar Town', 'DHA Phase 5', 'Gulberg', 'Model Town'];

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [areaNames, setAreaNames] = useState<string[]>(FALLBACK_AREAS);
  const [selectedArea, setSelectedArea] = useState<string>(FALLBACK_AREAS[0]);

  // Saved address logic
  const savedAddresses = user ? loadSavedAddresses(user.id) : [];
  const [addrMode, setAddrMode] = useState<'saved' | 'manual'>(savedAddresses.length > 0 ? 'saved' : 'manual');
  const [selectedSavedAddr, setSelectedSavedAddr] = useState<SavedAddress | null>(savedAddresses[0] ?? null);

  useEffect(() => {
    deliveryAreasApi.getActive()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res) => {
        const names = (res.data.data as any[]).map((a: any) => a.name);
        if (names.length > 0) {
          setAreaNames(names);
          setSelectedArea(names[0]);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const finalTotal = totalPrice + DELIVERY_FEE;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const notes = data.get('instructions') as string;

    let deliveryAddress: string;
    if (addrMode === 'saved' && selectedSavedAddr) {
      deliveryAddress = `${selectedSavedAddr.label}: ${selectedSavedAddr.phone}, ${selectedSavedAddr.line1}${selectedArea ? ', ' + selectedArea : ''}, ${selectedSavedAddr.city}`;
    } else {
    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;
    const phone = data.get('phone') as string;
    const address = data.get('address') as string;
    const city = data.get('city') as string;
    const province = data.get('state') as string;
      deliveryAddress = `${firstName} ${lastName}, ${phone}, ${address}${selectedArea ? ', ' + selectedArea : ''}, ${city}, ${province}`;
    }

    const orderItems = items.map((item) => ({
      foodItemId: item.id,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    setIsSubmitting(true);
    try {
      const res = await ordersApi.place({
        deliveryAddress,
        notes: notes || undefined,
        items: orderItems,
      });
      const order = res.data.data as { id: string };
      setOrderPlaced(true);
      clearCart();
      setTimeout(() => navigate(`/order-tracking/${order.id}`), 2500);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-gray-950">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="text-center px-4"
        >
          <div className="bg-green-100 dark:bg-green-900/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Thank you for your order. We'll start preparing your delicious meal right away!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to order tracking...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your order</p>
        </motion.div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Delivery Address
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {/* Delivery area selector */}
                      {areaNames.length > 0 && (
                        <div>
                          <Label className="mb-2 block">Delivery Area</Label>
                          <div className="flex flex-wrap gap-2">
                            {areaNames.map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => setSelectedArea(name)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                                  selectedArea === name
                                    ? 'bg-orange-600 border-orange-600 text-white font-medium shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-400 dark:hover:border-orange-500'
                                }`}
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Saved address toggle (only shown if user has saved addresses) */}
                      {savedAddresses.length > 0 && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAddrMode('saved')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-all ${
                              addrMode === 'saved'
                                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-400'
                            }`}
                          >
                            <BookUser className="w-4 h-4" />
                            Use Saved Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddrMode('manual')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-all ${
                              addrMode === 'manual'
                                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-400'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                            Fill Manually
                          </button>
                        </div>
                      )}

                      {/* Saved address picker */}
                      {addrMode === 'saved' && savedAddresses.length > 0 && (
                        <div className="space-y-2">
                          {savedAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => setSelectedSavedAddr(addr)}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                selectedSavedAddr?.id === addr.id
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'
                              }`}
                            >
                              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{addr.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{addr.line1}, {addr.city} · {addr.phone}</p>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Manual address form */}
                      {addrMode === 'manual' && (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" name="firstName" required placeholder="Ali" />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" name="lastName" required placeholder="Ahmed" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="+92 321 1234567" />
                      </div>
                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          required
                              placeholder="House no., street, block"
                          rows={3}
                        />
                      </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                              <Input id="city" name="city" required placeholder="Lahore" defaultValue="Lahore" />
                        </div>
                        <div>
                          <Label htmlFor="state">Province</Label>
                              <Input id="state" name="state" required placeholder="Punjab" defaultValue="Punjab" />
                        </div>
                      </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Payment Method
                      </h2>
                    </div>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="font-medium">Cash on Delivery</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="easypaisa" id="easypaisa" />
                          <Label htmlFor="easypaisa" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <Wallet className="w-5 h-5 text-green-500" />
                            <div>
                              <div className="font-medium">EasyPaisa</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Pay via EasyPaisa mobile wallet</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="jazzcash" id="jazzcash" />
                          <Label htmlFor="jazzcash" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <Wallet className="w-5 h-5 text-red-500" />
                            <div>
                              <div className="font-medium">JazzCash</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Pay via JazzCash mobile wallet</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Credit / Debit Card</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, HBL, Meezan</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Special Instructions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      placeholder="Any special requests for your order..."
                      rows={3}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24"
              >
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>Rs. {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Delivery Fee</span>
                        <span>Rs. {DELIVERY_FEE}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-6">
                      <span>Total</span>
                      <span className="text-orange-600">Rs. {finalTotal.toLocaleString()}</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order…
                        </span>
                      ) : 'Place Order'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      By placing this order, you agree to our Terms & Conditions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}