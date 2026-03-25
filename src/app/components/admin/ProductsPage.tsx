import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { ProductFormModal } from './ProductFormModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully!');
    } else {
      addProduct(productData);
      toast.success('Product added successfully!');
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast.success('Product deleted successfully!');
      setProductToDelete(null);
    }
  };

  const handleToggleStatus = (product: any) => {
    updateProduct(product.id, {
      status: product.status === 'active' ? 'hidden' : 'active',
    });
    toast.success(
      `Product ${product.status === 'active' ? 'hidden' : 'activated'} successfully!`
    );
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar title="Product Management" />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : ''
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'}
              </p>
              {!searchQuery && selectedCategory === 'All' && (
                <Button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${
                        product.status === 'active'
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{product.category}</Badge>
                      <p className="font-bold text-orange-600 dark:text-orange-500">
                        Rs. {product.price}
                      </p>
                    </div>

                    {product.orderCount !== undefined && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Orders:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.orderCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Rs. {(product.revenue || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(product)}
                        className="flex-1"
                      >
                        {product.status === 'active' ? (
                          <EyeOff className="w-4 h-4 mr-1" />
                        ) : (
                          <Eye className="w-4 h-4 mr-1" />
                        )}
                        {product.status === 'active' ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(product.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your
              inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
