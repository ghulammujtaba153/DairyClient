import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Package,
  Factory,
  Boxes,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Receipt,
  FileText,
  Settings as SettingsIcon,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Truck,
  LogOut,
} from 'lucide-react';
import { useAuthContext } from '../context/useAuthContext';

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Clients', path: '/clients', icon: User },
  { name: 'Suppliers', path: '/suppliers', icon: Truck },
  { name: 'Raw Material Management', path: '/raw-material', icon: Package },
  { name: 'Production Management', path: '/production', icon: Factory },
  { name: 'Inventory / Stock', path: '/inventory', icon: Boxes },
  {
    name: 'Sales',
    path: '/sales',
    icon: ShoppingCart,
    children: [
      { name: 'All Sales', path: '/sales' },
      { name: 'Butter Sales', path: '/sales/butter' },
      { name: 'Ghee Sales', path: '/sales/ghee' },
      { name: 'Khoya Sales', path: '/sales/khoya' },
      { name: 'Cream Sales', path: '/sales/cream' },
    ],
  },
  
  { name: 'Labour Management', path: '/labour', icon: Users },
  { name: 'Recovery / Receivables', path: '/recovery', icon: DollarSign },
  { name: 'Profit & Loss', path: '/profit-loss', icon: TrendingUp },
  { name: 'Balance Sheet', path: '/balance-sheet', icon: BarChart3 },
  { name: 'Cash Flow', path: '/cash-flow', icon: Receipt },
  { name: 'Reports & Analytics', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({ Sales: true });
  const location = useLocation();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-40 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Al Iqbal Dairy Farm</h2>
              <p className="text-xs text-slate-500">ERP Management System</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="p-3 overflow-y-auto flex-1">
          {navigation.map((item) => (
            <div key={item.name} className="mb-1">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-green-50 text-[var(--dairy-green-dark)]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${expandedMenus[item.name] ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {expandedMenus[item.name] && !sidebarCollapsed && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            location.pathname === child.path
                              ? 'bg-green-50 text-[var(--dairy-green-dark)]'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-50 text-[var(--dairy-green-dark)]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* Sidebar Footer with Logout */}
        <div className="w-full p-4 border-t border-slate-200 bg-white shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Calendar size={20} className="text-slate-500" />
              <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-slate-100">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                <div className="w-8 h-8 bg-[var(--dairy-green)] rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-800">Owner</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
