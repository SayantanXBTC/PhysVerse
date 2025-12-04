import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Trash2, 
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Activity
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: storeUser, setUser, logout } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [stats, setStats] = useState<any>(null);
  
  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await authService.getUserStats();
      setName(data.user.name);
      setEmail(data.user.email);
      setAvatar(data.user.avatar || '');
      setStats(data.stats);
      setUser(data.user);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = await authService.updateProfile(name, avatar || undefined);
      setUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (error: unknown) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Compress and convert image
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Failed to process image');
          return;
        }

        // Calculate new dimensions (max 400x400)
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression (0.7 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        // Check compressed size (should be under 500KB)
        const sizeInBytes = (compressedBase64.length * 3) / 4;
        if (sizeInBytes > 500 * 1024) {
          toast.error('Image is still too large after compression. Please use a smaller image.');
          return;
        }

        setAvatar(compressedBase64);
        toast.success('Avatar updated! Click Save Changes to apply.');
      };
      img.onerror = () => {
        toast.error('Failed to load image');
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      toast.error('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    setIsSaving(true);

    try {
      await authService.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error: unknown) {
      toast.error(error.response?.data?.error || 'Failed to delete account');
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="glass-red p-8 rounded-2xl text-center animate-scaleIn">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-red-500/50 overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label 
                  htmlFor="avatarUpload"
                  className="absolute bottom-0 right-0 p-2 bg-red-600 hover:bg-red-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                  aria-label="Change avatar"
                >
                  <Camera size={16} />
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <h2 className="text-2xl font-bold mb-1">{name}</h2>
              <p className="text-gray-400 mb-4">{email}</p>

              {storeUser?.isEmailVerified ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-semibold">
                  <Shield size={16} />
                  Verified Account
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-yellow-400 text-sm font-semibold">
                  <Shield size={16} />
                  Unverified
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 hover:bg-red-900/60 border-2 border-red-500/30 hover:border-red-500/60 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>

            {/* Stats Card */}
            {stats && (
              <div className="glass-red p-6 rounded-2xl animate-scaleIn">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="text-red-400" size={20} />
                  Account Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Simulations Created</span>
                    <span className="text-white font-bold">{stats.simulationsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total Time</span>
                    <span className="text-white font-bold">{stats.totalSimulationTime}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Account Age</span>
                    <span className="text-white font-bold">{stats.accountAge} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="glass-red p-8 rounded-2xl animate-slideInRight">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-red-400" size={24} />
                Profile Information
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    className="input opacity-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-200 mb-2">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="avatar"
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Security Section */}
            <div className="glass-red p-8 rounded-2xl animate-slideInRight" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="text-red-400" size={24} />
                Security
              </h3>

              {!showPasswordSection ? (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="btn-secondary"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-200 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Danger Zone */}
            <div className="glass-red p-8 rounded-2xl border-2 border-red-500/40 animate-slideInRight" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
                <Trash2 size={24} />
                Danger Zone
              </h3>
              <p className="text-gray-300 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl font-semibold text-red-400 transition-all duration-300 hover:scale-105"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-red p-8 rounded-2xl max-w-md w-full animate-bounceIn">
            <h3 className="text-2xl font-bold mb-4 text-red-400">Delete Account?</h3>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. All your simulations and data will be permanently deleted.
            </p>

            <div className="mb-6">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-200 mb-2">
                Enter your password to confirm
              </label>
              <input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="input"
                placeholder="Your password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isSaving || !deletePassword}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
