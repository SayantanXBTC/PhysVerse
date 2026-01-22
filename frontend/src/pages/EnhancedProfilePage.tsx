import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  Activity,
  Trophy,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { authService } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import AchievementCard from '../components/AchievementCard';
import PremiumPhotoUpload from '../components/PremiumPhotoUpload';

export default function EnhancedProfilePage() {
  const navigate = useNavigate();
  const { user: storeUser, setUser, logout } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'activity'>('profile');
  
  // Profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
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

  // Gamification data
  const { data: progressData } = useQuery({
    queryKey: ['progress'],
    queryFn: gamificationService.getProgress,
    enabled: !!storeUser
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements'],
    queryFn: gamificationService.getAchievements,
    enabled: !!storeUser
  });

  const { data: activitiesData } = useQuery({
    queryKey: ['activities', 'user'],
    queryFn: () => gamificationService.getActivities(true, 50),
    enabled: !!storeUser
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await authService.getUserStats();
      setName(data.user.name);
      setEmail(data.user.email);
      setAvatar(data.user.avatar || '');
      setBio(data.user.bio || '');
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Failed to process image');
          return;
        }

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
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        const sizeInBytes = (compressedBase64.length * 3) / 4;
        
        if (sizeInBytes > 500 * 1024) {
          toast.error('Image is still too large after compression');
          return;
        }

        setAvatar(compressedBase64);
        toast.success('Avatar updated! Click Save Changes to apply.');
      };
      img.src = reader.result as string;
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
    } catch (error: any) {
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
            Profile & Progress
          </h1>
          <p className="text-gray-400">Manage your account and track your achievements</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="glass-red p-8 rounded-2xl text-center animate-scaleIn">
              <div className="mb-6">
                <PremiumPhotoUpload
                  currentAvatar={avatar}
                  onPhotoChange={setAvatar}
                  isUploading={isSaving}
                />
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
                type="button"
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 hover:bg-red-900/60 border-2 border-red-500/30 hover:border-red-500/60 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>

            {/* Progress Card */}
            {progressData && (
              <ProgressBar
                level={progressData.level}
                xp={progressData.xp}
                xpInCurrentLevel={progressData.xpInCurrentLevel}
                xpForNextLevel={progressData.xpForNextLevel}
                xpProgress={progressData.xpProgress}
              />
            )}

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
                  {progressData && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Achievements</span>
                      <span className="text-white font-bold">{progressData.achievementCount}/{progressData.totalAchievements}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 glass-red p-2 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={20} />
                Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'achievements'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Trophy size={20} />
                Achievements
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'activity'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp size={20} />
                Activity
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
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
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-200 mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="input min-h-[100px]"
                        maxLength={500}
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs text-gray-400 mt-1">{bio.length}/500 characters</p>
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
                <div className="glass-red p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="text-red-400" size={24} />
                    Security
                  </h3>

                  {!showPasswordSection ? (
                    <button
                      type="button"
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
                <div className="glass-red p-8 rounded-2xl border-2 border-red-500/40">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
                    <Trash2 size={24} />
                    Danger Zone
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl font-semibold text-red-400 transition-all duration-300 hover:scale-105"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="glass-red p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={24} />
                    Achievements
                  </h3>
                  {progressData && (
                    <span className="text-sm text-gray-400">
                      {progressData.achievementCount} / {progressData.totalAchievements} Unlocked
                    </span>
                  )}
                </div>

                {achievementsData?.achievements ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {achievementsData.achievements.map((achievement: any) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="mx-auto mb-4 text-gray-600" size={64} />
                    <p className="text-gray-400">Loading achievements...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="glass-red p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="text-blue-400" size={24} />
                  Recent Activity
                </h3>

                {activitiesData?.activities && activitiesData.activities.length > 0 ? (
                  <div className="space-y-4">
                    {activitiesData.activities.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center flex-shrink-0">
                            {activity.type === 'achievement_unlocked' && <Trophy size={20} className="text-white" />}
                            {activity.type === 'level_up' && <Star size={20} className="text-white" />}
                            {activity.type === 'simulation_created' && <Activity size={20} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {activity.type === 'achievement_unlocked' && `Unlocked: ${activity.metadata.achievementName}`}
                              {activity.type === 'level_up' && `Reached Level ${activity.metadata.level}!`}
                              {activity.type === 'simulation_created' && `Created: ${activity.metadata.simulationName}`}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="mx-auto mb-4 text-gray-600" size={64} />
                    <p className="text-gray-400">No activity yet. Start creating simulations!</p>
                  </div>
                )}
              </div>
            )}
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
                type="button"
                onClick={handleDeleteAccount}
                disabled={isSaving || !deletePassword}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                type="button"
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
