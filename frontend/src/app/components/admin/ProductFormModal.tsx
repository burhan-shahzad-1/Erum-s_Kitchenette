import { useState, useEffect, useRef } from 'react';
import { X, Upload, Link, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: 'active' | 'hidden';
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  product?: Product;
}

const categories = [
  'Main Dishes',
  'Appetizers',
  'Desserts',
  'Beverages',
  'Snacks',
  'Other',
];

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

async function uploadToCloudinary(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText) as { secure_url: string };
        resolve(res.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

export function ProductFormModal({ isOpen, onClose, onSave, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Main Dishes',
    image: '',
    status: 'active' as 'active' | 'hidden',
  });

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        status: product.status,
      });
    } else {
      setFormData({ name: '', description: '', price: 0, category: 'Main Dishes', image: '', status: 'active' });
    }
    setUploadState('idle');
    setUploadProgress(0);
    setUploadError(null);
    setShowUrlInput(false);
  }, [product, isOpen]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10 MB');
      return;
    }

    setUploadError(null);
    setUploadState('uploading');
    setUploadProgress(0);

    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      setFormData((prev) => ({ ...prev, image: url }));
      setUploadState('done');
    } catch {
      setUploadState('error');
      setUploadError('Upload failed. Check your internet connection and try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const imageAreaContent = () => {
    if (uploadState === 'uploading') {
      return (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading… {uploadProgress}%</p>
          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      );
    }

    if (formData.image && uploadState === 'done') {
      return (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <img
            src={formData.image}
            alt="Uploaded preview"
            className="w-32 h-32 rounded-xl object-cover border-2 border-green-200 dark:border-green-800 shadow"
          />
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Image uploaded successfully</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => { setFormData((p) => ({ ...p, image: '' })); setUploadState('idle'); }}
          >
            Replace image
          </Button>
        </div>
      );
    }

    if (formData.image && product) {
      return (
        <div className="flex flex-col items-center gap-3">
          <img
            src={formData.image}
            alt="Current product"
            className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700 shadow"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Current image</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace image
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <ImageIcon className="w-7 h-7 text-orange-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Drag & drop an image here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">or click to browse</p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG, WEBP · Max 10 MB</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Chicken Biryani"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the product"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Product Image</Label>
              <button
                type="button"
                onClick={() => setShowUrlInput((v) => !v)}
                className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline"
              >
                <Link className="w-3.5 h-3.5" />
                {showUrlInput ? 'Hide URL input' : 'Use image URL instead'}
              </button>
            </div>

            {/* Drop zone */}
            {!showUrlInput && (
              <div
                onClick={() => uploadState !== 'uploading' && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer
                  ${isDragging
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : uploadState === 'done'
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/10 cursor-default'
                    : 'border-gray-300 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                  }
                  ${uploadState === 'uploading' ? 'pointer-events-none' : ''}
                `}
              >
                {imageAreaContent()}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                />

                {uploadState === 'idle' && !formData.image && (
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Upload</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL input fallback */}
            {showUrlInput && (
              <div className="space-y-2">
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <Label htmlFor="status" className="text-base">Active Status</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product will be {formData.status === 'active' ? 'visible' : 'hidden'} to customers
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked ? 'active' : 'hidden' })
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploadState === 'uploading' || !formData.image}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white disabled:opacity-50"
            >
              {uploadState === 'uploading' ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…</>
              ) : product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
