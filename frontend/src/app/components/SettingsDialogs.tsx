import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPreferencesDialog({ isOpen, onClose }: DialogProps) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Email Notifications</label>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">SMS Notifications</label>
            <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Order Updates</label>
            <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Promotions & Offers</label>
            <Switch checked={promotions} onCheckedChange={setPromotions} />
          </div>
          <Button
            onClick={() => {
              toast.success('Preferences saved!');
              onClose();
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
          >
            Save Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function PrivacySettingsDialog({ isOpen, onClose }: DialogProps) {
  const [profileVisible, setProfileVisible] = useState(true);
  const [orderHistoryVisible, setOrderHistoryVisible] = useState(false);
  const [shareData, setShareData] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Privacy Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Profile Visible to Others</label>
            <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Show Order History</label>
            <Switch checked={orderHistoryVisible} onCheckedChange={setOrderHistoryVisible} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Share Data for Analytics</label>
            <Switch checked={shareData} onCheckedChange={setShareData} />
          </div>
          <Button
            onClick={() => {
              toast.success('Privacy settings updated!');
              onClose();
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
          >
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function DietaryPreferencesDialog({ isOpen, onClose }: DialogProps) {
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [halal, setHalal] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Dietary Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Vegetarian</label>
            <Switch checked={vegetarian} onCheckedChange={setVegetarian} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Vegan</label>
            <Switch checked={vegan} onCheckedChange={setVegan} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Gluten-Free</label>
            <Switch checked={glutenFree} onCheckedChange={setGlutenFree} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Halal</label>
            <Switch checked={halal} onCheckedChange={setHalal} />
          </div>
          <Button
            onClick={() => {
              toast.success('Dietary preferences saved!');
              onClose();
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
          >
            Save Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function SavedAddressesDialog({ isOpen, onClose }: DialogProps) {
  const [addresses, setAddresses] = useState([
    'Johar Town, Lahore',
    'DHA Phase 6, Lahore',
  ]);
  const [newAddress, setNewAddress] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative sticky top-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Saved Addresses</h2>
        </div>
        <div className="p-6 space-y-4">
          {addresses.map((addr, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">{addr}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAddresses(addresses.filter((_, i) => i !== idx))}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add new address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Button
              onClick={() => {
                if (newAddress.trim()) {
                  setAddresses([...addresses, newAddress]);
                  setNewAddress('');
                  toast.success('Address added!');
                }
              }}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function PaymentMethodsDialog({ isOpen, onClose }: DialogProps) {
  const [cards, setCards] = useState([
    { last4: '4242', type: 'Visa' },
    { last4: '5555', type: 'Mastercard' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Payment Methods</h2>
        </div>
        <div className="p-6 space-y-4">
          {cards.map((card, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">
                {card.type} •••• {card.last4}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCards(cards.filter((_, i) => i !== idx))}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => toast.success('Add card functionality coming soon!')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </div>
      </motion.div>
    </div>
  );
}