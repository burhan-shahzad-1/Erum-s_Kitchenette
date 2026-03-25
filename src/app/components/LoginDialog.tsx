import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginDialog({ isOpen, onClose, onSwitchToSignup }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    toast.success('Logged in successfully!');
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/50 backdrop-blur-sm p-4"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ margin: 'auto' }}
      >
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-orange-100 mt-1">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
          >
            Login
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
