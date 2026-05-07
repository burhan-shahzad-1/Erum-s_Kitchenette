import { useState } from 'react';
import { Moon, Sun, KeyRound } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../context/ThemeContext';
import { ChangePasswordDialog } from '../ChangePasswordDialog';

interface AdminNavbarProps {
  title: string;
}

export function AdminNavbar({ title }: AdminNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showChangePw, setShowChangePw] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Admin Avatar + Change Password */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Erum's Kitchette</p>
              </div>
              <button
                onClick={() => setShowChangePw(true)}
                title="Change password"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity relative group"
              >
                EK
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Change password
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordDialog isOpen={showChangePw} onClose={() => setShowChangePw(false)} />
    </>
  );
}
