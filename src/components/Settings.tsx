import { Save, User, Building2, Bell, Lock, Palette, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-sm text-slate-600 mt-1">Configure your dairy farm management system</p>
        </div>
      </div>

      {/* Business Profile */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Building2 size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>Business Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
            <input
              type="text"
              defaultValue="Al Iqbal Dairy Farm"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Owner Name</label>
            <input
              type="text"
              defaultValue="Muhammad Iqbal"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
            <input
              type="tel"
              defaultValue="+92 300 1234567"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="info@aliqbaldairy.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Business Address</label>
            <textarea
              rows={2}
              defaultValue="Main GT Road, Lahore, Punjab, Pakistan"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            ></textarea>
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* User Account */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>User Account</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              type="text"
              defaultValue="admin"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>Owner / Administrator</option>
              <option>Manager</option>
              <option>Accountant</option>
              <option>Sales Person</option>
            </select>
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          <Save size={18} />
          Update Account
        </button>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div></div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          Change Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-[var(--dairy-green-dark)] rounded focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
            <div>
              <p className="font-medium text-slate-900">Low Stock Alerts</p>
              <p className="text-sm text-slate-600">Get notified when products are below minimum stock level</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-[var(--dairy-green-dark)] rounded focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
            <div>
              <p className="font-medium text-slate-900">Overdue Payments</p>
              <p className="text-sm text-slate-600">
                Receive alerts for customer payments overdue by more than 30 days
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-[var(--dairy-green-dark)] rounded focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
            <div>
              <p className="font-medium text-slate-900">Daily Sales Summary</p>
              <p className="text-sm text-slate-600">Receive daily sales report at end of day</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-[var(--dairy-green-dark)] rounded focus:ring-2 focus:ring-[var(--dairy-green)]"
            />
            <div>
              <p className="font-medium text-slate-900">Production Updates</p>
              <p className="text-sm text-slate-600">Get notified when production batches are completed</p>
            </div>
          </label>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          <Save size={18} />
          Save Preferences
        </button>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Database size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>System Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>PKR - Pakistani Rupee</option>
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>DD-MM-YYYY</option>
              <option>MM-DD-YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>English</option>
              <option>Urdu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fiscal Year Start</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--dairy-green)]">
              <option>January</option>
              <option>July</option>
            </select>
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--dairy-green-dark)] text-white rounded-lg hover:bg-[var(--dairy-green)] transition-colors">
          <Save size={18} />
          Save Settings
        </button>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Palette size={24} className="text-[var(--dairy-green-dark)]" />
          <h3>Appearance</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-[var(--dairy-green-dark)] text-white rounded-lg">Light</button>
              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Dark
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Accent Color</label>
            <div className="flex gap-3">
              <button className="w-12 h-12 bg-green-500 rounded-lg border-4 border-green-700"></button>
              <button className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-slate-300"></button>
              <button className="w-12 h-12 bg-purple-500 rounded-lg border-2 border-slate-300"></button>
              <button className="w-12 h-12 bg-orange-500 rounded-lg border-2 border-slate-300"></button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <h4 className="font-medium mb-1">Backup Data</h4>
            <p className="text-sm">Create a backup of all business data</p>
          </button>
          <button className="p-4 border-2 border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left">
            <h4 className="font-medium mb-1">Export Data</h4>
            <p className="text-sm">Export data to Excel or CSV</p>
          </button>
          <button className="p-4 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-left">
            <h4 className="font-medium mb-1">Import Data</h4>
            <p className="text-sm">Import data from external sources</p>
          </button>
          <button className="p-4 border-2 border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left">
            <h4 className="font-medium mb-1">Clear Cache</h4>
            <p className="text-sm">Clear temporary data and cache</p>
          </button>
        </div>
      </div>
    </div>
  );
}
