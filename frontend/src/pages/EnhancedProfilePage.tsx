import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Shield,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Activity,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Beaker,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { authService } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import AchievementCard from '../components/AchievementCard';
import PremiumPhotoUpload from '../components/PremiumPhotoUpload';

type Tab = 'profile' | 'achievements' | 'activity' | 'security';

export default function EnhancedProfilePage() {
  const navigate = useNavigate();
  const { user: storeUser, setUser, logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [stats, setStats] = useState<any>(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setActiveTab('profile');
    requestAnimationFrame(() => {
      const el = nameInputRef.current;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
        el.select();
      }
    });
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = await authService.updateProfile(name, avatar || undefined, bio);
      setUser(data.user);
      toast.success('Profile updated');
      loadUserData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (photoData: string) => {
    setAvatar(photoData);
    authService
      .updateProfile(name, photoData, bio)
      .then((data) => {
        setUser(data.user);
        toast.success('Photo updated');
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.error || 'Failed to update photo');
      });
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
      toast.success('Password changed');
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }
    if (!deletePassword) {
      toast.error('Enter your password');
      return;
    }
    setIsSaving(true);
    try {
      await authService.deleteAccount(deletePassword);
      toast.success('Account deleted');
      logout();
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete account');
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    window.location.assign('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  const level = progressData?.level ?? 1;
  const xp = progressData?.xp ?? 0;
  const xpProgress = progressData?.xpProgress ?? 0;
  const xpInCurrentLevel = progressData?.xpInCurrentLevel ?? 0;
  const xpForNextLevel = progressData?.xpForNextLevel ?? 100;
  const xpToNext = Math.max(0, xpForNextLevel - xpInCurrentLevel);

  const statTiles = [
    { icon: Beaker, label: 'Simulations', value: stats?.simulationsCreated ?? 0 },
    { icon: Clock, label: 'Lab Time', value: `${stats?.totalSimulationTime ?? 0}h` },
    { icon: Calendar, label: 'Days Active', value: stats?.accountAge ?? 0 },
    {
      icon: Trophy,
      label: 'Achievements',
      value: progressData ? `${progressData.achievementCount}/${progressData.totalAchievements}` : '—'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-rose-950/30 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0 L0 0 0 60" fill="none" stroke="#E5484D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profgrid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2">
            Account
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
            Profile & Progress
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Your identity, achievements, and journey.
          </p>
        </header>

        <section className="relative mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#131316] via-[#0e0e10] to-[#0a0a0c] overflow-hidden shadow-2xl shadow-red-950/40">
          <svg className="pointer-events-none absolute -right-20 -top-20 w-[420px] h-[420px] opacity-[0.08]" viewBox="0 0 400 400" aria-hidden="true">
            <g fill="none" stroke="#E5484D" strokeWidth="1">
              {[80, 130, 180, 230, 280].map((r) => (
                <ellipse key={r} cx="200" cy="200" rx={r} ry={r * 0.35} />
              ))}
            </g>
          </svg>

          <div className="relative grid lg:grid-cols-[auto,1fr,auto] gap-6 lg:gap-10 p-6 sm:p-8 lg:p-10 items-center">
            <div className="flex justify-center lg:justify-start">
              <PremiumPhotoUpload
                currentAvatar={avatar}
                onPhotoChange={handlePhotoChange}
                isUploading={false}
              />
            </div>

            <div className="text-center lg:text-left space-y-3 min-w-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight truncate">
                  {name || 'Explorer'}
                </h2>
                <p className="text-sm text-gray-400 truncate">{email}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {storeUser?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
                    <Shield size={12} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
                    <Shield size={12} /> Unverified
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-300 text-xs font-semibold font-mono tabular-nums">
                  <Sparkles size={12} /> LVL {level}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-gray-300 text-xs font-mono tabular-nums">
                  {xp} XP
                </span>
              </div>

              {bio && (
                <p className="text-sm text-gray-300 leading-relaxed max-w-xl italic [text-wrap:pretty] mx-auto lg:mx-0">
                  "{bio}"
                </p>
              )}

              <div className="pt-2 space-y-1.5 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-gray-500">
                  <span>Level {level}</span>
                  <span className="text-red-400">{xpToNext} XP to Level {level + 1}</span>
                </div>
                <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-red-500 to-rose-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(229,72,77,0.6)]"
                    style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 tabular-nums">
                  <span>{xpInCurrentLevel} XP</span>
                  <span>{xpForNextLevel} XP</span>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col gap-2 justify-center">
              <button
                type="button"
                onClick={handleEditClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <User size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-white text-sm font-semibold rounded-lg transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-2 sm:grid-cols-4 border-t border-white/[0.06] bg-black/40">
            {statTiles.map((s) => (
              <div
                key={s.label}
                className="relative p-4 sm:p-5 border-r last:border-r-0 border-white/[0.06] flex items-center gap-3 group hover:bg-red-500/[0.04] transition-colors"
              >
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 group-hover:scale-105 transition-transform">
                  <s.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-black text-white tabular-nums leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-mono">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <nav
          className="mb-6 border-b border-white/[0.08] overflow-x-auto"
          role="tablist"
          aria-label="Profile sections"
        >
          <div className="flex gap-1 min-w-max">
            {([
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'activity', label: 'Activity', icon: TrendingUp },
              { id: 'security', label: 'Security', icon: Lock }
            ] as const).map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                  {isActive && (
                    <span className="absolute -bottom-px left-2 right-2 h-[2px] bg-gradient-to-r from-red-500 to-rose-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {activeTab === 'profile' && (
          <section className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-red-400" size={18} />
              <h3 className="text-lg font-bold text-white">Profile Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-2xl">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white placeholder-gray-500 outline-none transition-colors"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-gray-500 cursor-not-allowed outline-none"
                  disabled
                />
                <p className="text-[11px] text-gray-500 mt-1.5">Email cannot be changed.</p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Bio <span className="text-gray-600 normal-case font-normal">— optional</span>
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white placeholder-gray-500 outline-none transition-colors min-h-[110px] resize-none"
                  maxLength={500}
                  placeholder="Tell the community about your work..."
                />
                <p className="text-[11px] text-gray-500 mt-1.5 tabular-nums">
                  {bio.length}/500 characters
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'achievements' && (
          <section className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="text-red-400" size={18} />
                <h3 className="text-lg font-bold text-white">Achievements</h3>
              </div>
              {progressData && (
                <span className="font-mono text-xs text-gray-400 tabular-nums">
                  {progressData.achievementCount} / {progressData.totalAchievements} unlocked
                </span>
              )}
            </div>

            {achievementsData?.achievements && achievementsData.achievements.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievementsData.achievements.map((achievement: any) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Award className="mx-auto mb-4 text-gray-700" size={48} />
                <p className="text-gray-400 text-sm">No achievements loaded yet.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'activity' && (
          <section className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-red-400" size={18} />
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>

            {activitiesData?.activities && activitiesData.activities.length > 0 ? (
              <ol className="relative border-l border-white/[0.08] ml-2 space-y-5 pl-6">
                {activitiesData.activities.map((activity: any, index: number) => (
                  <li key={index} className="relative">
                    <span className="absolute -left-[31px] top-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15 border border-red-500/40 text-red-400">
                      {activity.type === 'achievement_unlocked' && <Trophy size={11} />}
                      {activity.type === 'level_up' && <Star size={11} />}
                      {activity.type === 'simulation_created' && <Beaker size={11} />}
                    </span>
                    <p className="text-white text-sm font-medium">
                      {activity.type === 'achievement_unlocked' && `Unlocked achievement — ${activity.metadata?.achievementName}`}
                      {activity.type === 'level_up' && `Reached Level ${activity.metadata?.level}`}
                      {activity.type === 'simulation_created' && `Created — ${activity.metadata?.simulationName}`}
                    </p>
                    <p className="text-[11px] font-mono text-gray-500 mt-0.5 tabular-nums">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center py-16">
                <Activity className="mx-auto mb-4 text-gray-700" size={48} />
                <p className="text-white font-semibold mb-1">No activity yet</p>
                <p className="text-gray-500 text-sm">
                  Simulations, achievements, and milestones will show here.
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="text-red-400" size={18} />
                <h3 className="text-lg font-bold text-white">Password</h3>
              </div>

              {!showPasswordSection ? (
                <div className="flex items-center justify-between gap-4 max-w-2xl">
                  <div>
                    <p className="text-white text-sm font-medium">Change password</p>
                    <p className="text-xs text-gray-400 mt-0.5">Keep your account secure.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Change <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        aria-label="Toggle current password visibility"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white outline-none transition-colors"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        aria-label="Toggle new password visibility"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Changing…' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            <section className="rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-[#0e0e10] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="text-red-500" size={18} />
                <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
              </div>
              <p className="text-gray-300 text-sm mb-5 max-w-xl">
                Delete your account permanently. All simulations, progress, and achievements will be lost. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/40 hover:border-red-500/70 text-red-300 hover:text-red-200 text-sm font-semibold rounded-lg transition-all"
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            </section>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setDeletePassword('');
              setDeleteConfirmText('');
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="max-w-md w-full rounded-2xl border border-red-500/40 bg-[#0e0e10] p-7 shadow-2xl shadow-red-950/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="text-red-500" size={20} />
              <h3 id="delete-title" className="text-xl font-black text-white">
                Delete Account?
              </h3>
            </div>
            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              This will permanently remove your profile, simulations, achievements, and progress. This action cannot be undone.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="deleteConfirm" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Type <span className="font-mono text-red-400">DELETE</span> to confirm
                </label>
                <input
                  id="deleteConfirm"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white font-mono outline-none transition-colors"
                  placeholder="DELETE"
                />
              </div>
              <div>
                <label htmlFor="deletePassword" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Password
                </label>
                <input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-lg text-white outline-none transition-colors"
                  placeholder="Your password"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isSaving || deleteConfirmText !== 'DELETE' || !deletePassword}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Deleting…' : 'Delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
