import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, MapPin, DollarSign, Clock } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

interface DeliveryAreaFormData {
  name: string;
  minOrder: number;
  deliveryCharge: number;
  isActive: boolean;
}

export function DeliveryPage() {
  const { deliveryAreas, updateDeliveryArea, addDeliveryArea, deliverySettings, saveDeliverySettings } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<any>(null);
  const [formData, setFormData] = useState<DeliveryAreaFormData>({
    name: '',
    minOrder: 500,
    deliveryCharge: 100,
    isActive: true,
  });

  // Local draft of settings — only persisted when "Save Settings" is clicked
  const [settingsDraft, setSettingsDraft] = useState(deliverySettings);

  const handleOpenModal = (area?: any) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        name: area.name,
        minOrder: area.minOrder,
        deliveryCharge: area.deliveryCharge,
        isActive: area.isActive,
      });
    } else {
      setEditingArea(null);
      setFormData({
        name: '',
        minOrder: 500,
        deliveryCharge: 100,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveArea = () => {
    if (editingArea) {
      updateDeliveryArea(editingArea.id, formData);
      toast.success('Delivery area updated successfully!');
    } else {
      addDeliveryArea(formData);
      toast.success('Delivery area added successfully!');
    }
    setIsModalOpen(false);
  };

  const handleToggleAreaStatus = (areaId: string, currentStatus: boolean) => {
    updateDeliveryArea(areaId, { isActive: !currentStatus });
    toast.success(`Delivery area ${!currentStatus ? 'activated' : 'deactivated'}!`);
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Delivery Management" />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Delivery Areas Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Areas</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage delivery zones and pricing
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Delivery Area
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {area.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Switch
                              checked={area.isActive}
                              onCheckedChange={() => handleToggleAreaStatus(area.id, area.isActive)}
                            />
                            <span className={`text-xs ${area.isActive ? 'text-green-600 dark:text-green-500' : 'text-gray-500'}`}>
                              {area.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(area)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Min. Order
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Rs. {area.minOrder}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery Fee
                        </span>
                        <span className="font-bold text-orange-600 dark:text-orange-500">
                          Rs. {area.deliveryCharge}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Settings Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Delivery Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Default Delivery Time (minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="deliveryTime"
                      type="number"
                      value={settingsDraft.defaultDeliveryTime}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          defaultDeliveryTime: Number(e.target.value),
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRadius">Max Delivery Radius (km)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="maxRadius"
                      type="number"
                      value={settingsDraft.maxDeliveryRadius}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          maxDeliveryRadius: Number(e.target.value),
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Free Delivery Threshold */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="freeDelivery" className="text-base">Enable Free Delivery</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Offer free delivery for orders above a certain amount
                  </p>
                </div>
                <Switch
                  id="freeDelivery"
                  checked={settingsDraft.freeDeliveryEnabled}
                  onCheckedChange={(checked) =>
                    setSettingsDraft({ ...settingsDraft, freeDeliveryEnabled: checked })
                  }
                />
              </div>

              {settingsDraft.freeDeliveryEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <Label htmlFor="threshold">Free Delivery Threshold (Rs.)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="threshold"
                      type="number"
                      value={settingsDraft.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </motion.div>
              )}

              <div className="pt-4">
                <Button
                  onClick={() => { saveDeliverySettings(settingsDraft); toast.success('Delivery settings saved!'); }}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Add/Edit Area Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArea ? 'Edit Delivery Area' : 'Add New Delivery Area'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="areaName">Area Name</Label>
              <Input
                id="areaName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Johar Town"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min. Order (Rs.)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrder: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryCharge">Delivery Fee (Rs.)</Label>
                <Input
                  id="deliveryCharge"
                  type="number"
                  value={formData.deliveryCharge}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryCharge: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSaveArea}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                {editingArea ? 'Update' : 'Add'} Area
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
