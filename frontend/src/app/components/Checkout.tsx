import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, CreditCard, Wallet, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { Separator } from './ui/separator';
import { ordersApi } from '../lib/api';
import { toast } from 'sonner';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const tax = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryFee + tax;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;
    const phone = data.get('phone') as string;
    const address = data.get('address') as string;
    const city = data.get('city') as string;
    const province = data.get('state') as string;
    const notes = data.get('instructions') as string;

    const deliveryAddress = `${firstName} ${lastName}, ${phone}, ${address}, ${city}, ${province}`;

    setIsSubmitting(true);
    try {
      const res = await ordersApi.place({ deliveryAddress, notes: notes || undefined });
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
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" name="firstName" required placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" name="lastName" required placeholder="Doe" />
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
                          placeholder="Building name, street, area"
                          rows={3}
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" required placeholder="Lahore" />
                        </div>
                        <div>
                          <Label htmlFor="state">Province</Label>
                          <Input id="state" name="state" required placeholder="Sindh" />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Postal Code</Label>
                          <Input id="pincode" name="pincode" required placeholder="75600" />
                        </div>
                      </div>
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
                        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="font-medium">Cash on Delivery</div>
                              <div className="text-sm text-gray-600">Pay when you receive</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <Wallet className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="font-medium">UPI</div>
                              <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Credit/Debit Card</div>
                              <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
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
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs. {totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                          {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (5%)</span>
                        <span>Rs. {tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                      <span>Total</span>
                      <span className="text-orange-600">Rs. {finalTotal.toFixed(2)}</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
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