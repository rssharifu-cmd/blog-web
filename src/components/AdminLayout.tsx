import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, FolderKanban, Settings, Key, LogOut, 
  Plus, Edit, Trash2, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';
import { Article, Category, Tag, SiteSettings } from '../types.js';
import ArticleEditor from './ArticleEditor.js';
import { 
  getArticles, 
  getSettings,
  saveSettings, 
  deleteArticle, 
  createCategory, 
  deleteCategory, 
  createTag, 
  loginAdmin, 
  registerAdmin,
  requestPasswordReset,
  verifySession, 
  changeAdminPassword, 
  isSupabaseConfigured
} from '../lib/supabase.js';

interface AdminLayoutProps {
  navigate: (path: string) => void;
  categories: Category[];
  tags: Tag[];
  onRefreshData: () => void;
}

export default function AdminLayout({ navigate, categories, tags, onRefreshData }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active admin views: 'dashboard' | 'articles' | 'categories' | 'settings' | 'password' | 'editor'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'categories' | 'settings' | 'password' | 'editor'>('dashboard');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  // Settings edit states
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Forms states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [tagError, setTagError] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);
  const [tagSuccess, setTagSuccess] = useState(false);

  // Token management
  const getToken = () => localStorage.getItem('net_admin_token') || '';

  // Check auth session on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      verifySession(token)
        .then(valid => {
          if (valid) {
            setIsAuthenticated(true);
            fetchAdminData();
          } else {
            localStorage.removeItem('net_admin_token');
          }
        })
        .catch(() => localStorage.removeItem('net_admin_token'));
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const [artData, setData] = await Promise.all([
        getArticles(),
        getSettings()
      ]);

      setArticles(artData);
      setSiteSettings(setData);
    } catch (err) {
      console.error('Error fetching admin details:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccessMsg('');
    setLoginLoading(true);

    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem('net_admin_token', data.token);
      setIsAuthenticated(true);
      setPassword('');
      fetchAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccessMsg('');
    setLoginLoading(true);

    try {
      const res = await registerAdmin(email, password);
      if (res.success) {
        setAuthSuccessMsg(res.message);
        // Switch to login tab on success
        if (!isSupabaseConfigured) {
          setPassword('');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Registration failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccessMsg('');
    setLoginLoading(true);

    try {
      const success = await requestPasswordReset(email);
      if (success) {
        if (isSupabaseConfigured) {
          setAuthSuccessMsg('Password reset link sent! Please check your email inbox.');
        } else {
          setAuthSuccessMsg('Offline reset simulated. Default password is "admin123". Custom fallback saved.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Failed to request password reset.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('net_admin_token');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    if (!newCategoryName.trim()) return;

    try {
      const cat = await createCategory(newCategoryName, newCategoryDesc);
      if (cat) {
        setNewCategoryName('');
        setNewCategoryDesc('');
        setCategorySuccess(true);
        setTimeout(() => setCategorySuccess(false), 3000);
        onRefreshData();
      } else {
        setCategoryError('Failed to create category. Database returned an empty response.');
      }
    } catch (err: any) {
      console.error(err);
      setCategoryError(err.message || 'Failed to create category. Please verify your database connection or permissions.');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setCategoryError('');

    try {
      const success = await deleteCategory(id);
      if (success) {
        onRefreshData();
      } else {
        setCategoryError('Failed to delete category.');
      }
    } catch (err: any) {
      console.error(err);
      setCategoryError(err.message || 'Failed to delete category.');
    }
  };

  // Create Tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setTagError('');
    if (!newTagName.trim()) return;

    try {
      const tag = await createTag(newTagName);
      if (tag) {
        setNewTagName('');
        setTagSuccess(true);
        setTimeout(() => setTagSuccess(false), 3000);
        onRefreshData();
      } else {
        setTagError('Failed to create tag.');
      }
    } catch (err: any) {
      console.error(err);
      setTagError(err.message || 'Failed to create tag. Please verify your database connection or permissions.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;

    try {
      const success = await saveSettings(siteSettings);
      if (success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3500);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const success = await changeAdminPassword(newPassword);
      if (success) {
        setPasswordSuccess('Password updated successfully! Please keep it secure.');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    try {
      const success = await deleteArticle(id);
      if (success) {
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Editor for Edit or Create
  const handleOpenEditor = (id: string | null = null) => {
    setSelectedArticleId(id);
    setActiveTab('editor');
  };

  const handleEditorClose = () => {
    setActiveTab('articles');
    setSelectedArticleId(null);
    fetchAdminData();
    onRefreshData();
  };

  // Stats summaries
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalPublished = articles.filter(a => a.status === 'published').length;
  const totalDrafts = articles.filter(a => a.status === 'draft').length;

  // Unauthenticated - Render Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 transition-colors duration-200">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-zinc-800 text-white rounded-xl mb-4">
              <Sparkles className="h-6 w-6 text-gold-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">NetVentures CMS Login</h2>
            <p className="mt-2 text-xs text-gray-400">
              {isSupabaseConfigured 
                ? '🔐 Authenticating with live Supabase database' 
                : '💾 Running in offline fallback database mode'}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-lg mb-6 border border-zinc-800/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(''); setAuthSuccessMsg(''); }}
              className={`py-1.5 rounded-md transition-colors cursor-pointer ${authMode === 'login' ? 'bg-zinc-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setLoginError(''); setAuthSuccessMsg(''); }}
              className={`py-1.5 rounded-md transition-colors cursor-pointer ${authMode === 'register' ? 'bg-zinc-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('forgot'); setLoginError(''); setAuthSuccessMsg(''); }}
              className={`py-1.5 rounded-md transition-colors cursor-pointer ${authMode === 'forgot' ? 'bg-zinc-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              Recover
            </button>
          </div>

          <form 
            onSubmit={
              authMode === 'login' ? handleLogin : 
              authMode === 'register' ? handleRegister : 
              handleForgotPassword
            } 
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. editor@netventures.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm transition-all"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'register' ? 'Choose a strong password' : 'Enter password'}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm transition-all"
                />
              </div>
            )}

            {loginError && (
              <div className="flex items-start gap-2 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs animate-shake">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {loginLoading ? 'Processing...' : 
               authMode === 'login' ? 'Verify & Unlock CMS' : 
               authMode === 'register' ? 'Register Account' : 
               'Send Recovery Instructions'}
            </button>
          </form>

          {/* Quick Info context helper */}
          {!isSupabaseConfigured && authMode === 'login' && (
            <p className="mt-4 text-[11px] text-center text-zinc-500 font-mono">
              💡 Fallback credentials: admin@netventures.com / admin123
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to public website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - Render Administrative Portal
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
      
      {/* Top Admin Navbar */}
      <nav className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-zinc-800 text-gold-500 rounded">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="font-display font-bold text-base tracking-tight">
                NetVentures <span className="text-gold-500 text-xs font-mono font-medium border border-gold-500/20 px-1.5 py-0.5 rounded ml-2">CMS Portal</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                View Live Site
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs bg-zinc-800 text-gray-300 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3">
            <div className="space-y-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xs sticky top-24 transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Publishing Desk</p>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTab === 'articles' || activeTab === 'editor'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <FileText className="h-4.5 w-4.5" /> Articles ({articles.length})
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <FolderKanban className="h-4.5 w-4.5" /> Categories & Tags
              </button>

              <div className="h-px bg-gray-200 dark:bg-zinc-800 my-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Settings Desk</p>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Settings className="h-4.5 w-4.5" /> Site Configuration
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Key className="h-4.5 w-4.5" /> Change Password
              </button>
            </div>
          </aside>

          {/* Core Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Overview Dashboard</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Editorial performance and content metrics aggregated live.</p>
                  </div>
                  <button
                    onClick={() => handleOpenEditor()}
                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> New Article
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Articles</span>
                    <span className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-2">{articles.length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between bg-emerald-500/2 dark:bg-emerald-500/1 border-emerald-500/10">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Published Posts</span>
                    <span className="text-3xl font-display font-bold text-emerald-800 dark:text-emerald-400 mt-2">{totalPublished}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between bg-amber-500/2 dark:bg-amber-500/1 border-amber-500/10">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Draft Content</span>
                    <span className="text-3xl font-display font-bold text-amber-800 dark:text-amber-400 mt-2">{totalDrafts}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between bg-purple-500/2 dark:bg-purple-500/1 border-purple-500/10">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> Total Traffic
                    </span>
                    <span className="text-3xl font-display font-bold text-purple-800 dark:text-purple-400 mt-2">{totalViews}</span>
                  </div>
                </div>

                {/* Latest list overview */}
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs">
                  <h3 className="font-display font-bold text-base text-gray-900 dark:text-white mb-4">Recently Managed Articles</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-gray-500 text-xs font-mono uppercase">
                          <th className="py-3 px-1 font-semibold">Title</th>
                          <th className="py-3 px-1 font-semibold">Category</th>
                          <th className="py-3 px-1 font-semibold">Views</th>
                          <th className="py-3 px-1 font-semibold">Status</th>
                          <th className="py-3 px-1 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 text-gray-700 dark:text-gray-300">
                        {articles.slice(0, 5).map((art) => (
                          <tr key={art.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20">
                            <td className="py-4 px-1 font-medium text-gray-900 dark:text-white max-w-xs truncate">{art.title}</td>
                            <td className="py-4 px-1">{categories.find(c => c.id === art.categoryId)?.name || 'Default'}</td>
                            <td className="py-4 px-1 font-mono text-xs">{art.views}</td>
                            <td className="py-4 px-1">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-mono ${
                                art.status === 'published' 
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {art.status}
                              </span>
                            </td>
                            <td className="py-4 px-1 text-right space-x-1.5">
                              <button 
                                onClick={() => handleOpenEditor(art.id)}
                                className="p-1 hover:text-gold-500 text-gray-400 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ARTICLES VIEW */}
            {activeTab === 'articles' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Articles Catalogue</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Compose, publish, draft, and optimize your business posts.</p>
                  </div>
                  <button
                    onClick={() => handleOpenEditor()}
                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> New Article
                  </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/30 text-gray-400 dark:text-gray-500 text-xs font-mono uppercase">
                          <th className="py-3 px-6 font-semibold">Title</th>
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-4 font-semibold">Published At</th>
                          <th className="py-3 px-4 font-semibold">Views</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-6 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 text-gray-700 dark:text-gray-300">
                        {articles.map((art) => (
                          <tr key={art.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20">
                            <td className="py-4 px-6 font-medium text-gray-900 dark:text-white max-w-sm truncate">{art.title}</td>
                            <td className="py-4 px-4">{categories.find(c => c.id === art.categoryId)?.name || 'Default'}</td>
                            <td className="py-4 px-4 font-mono text-xs text-gray-400">
                              {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-4 px-4 font-mono text-xs">{art.views}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-mono ${
                                art.status === 'published' 
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {art.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2.5">
                              <button 
                                onClick={() => handleOpenEditor(art.id)}
                                className="p-1 hover:text-gold-500 text-gray-400 transition-colors cursor-pointer inline-flex"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-1 hover:text-rose-500 text-gray-400 transition-colors cursor-pointer inline-flex"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CATEGORIES & TAGS VIEW */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                
                {/* Categories Management */}
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Site Categories</h3>
                    <p className="text-xs text-gray-400 mt-1">Silo your content categories to improve search architecture.</p>
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Category Name</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. AI tools, Affiliate Marketing"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Short Description</label>
                      <textarea
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        placeholder="Explain topic category focus..."
                        rows={2}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                      />
                    </div>

                    {categorySuccess && (
                      <p className="text-xs text-emerald-500 font-medium">Category created successfully!</p>
                    )}

                    {categoryError && (
                      <div className="flex items-start gap-2 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs animate-shake">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{categoryError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Create Category
                    </button>
                  </form>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                  {/* List categories */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Categories</p>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                      {categories.map((cat) => (
                        <div key={cat.id} className="py-2.5 flex items-center justify-between text-sm">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{cat.description || 'No description'}</p>
                          </div>
                          {cat.id !== 'cat-1' && (
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags Management */}
                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Content Tags</h3>
                    <p className="text-xs text-gray-400 mt-1">Granular keywords for programmatic and internal linking.</p>
                  </div>

                  <form onSubmit={handleCreateTag} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Tag Name</label>
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="e.g. passive-income, productivity"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                      />
                    </div>

                    {tagSuccess && (
                      <p className="text-xs text-emerald-500 font-medium">Tag created successfully!</p>
                    )}

                    {tagError && (
                      <div className="flex items-start gap-2 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs animate-shake">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{tagError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Create Tag
                    </button>
                  </form>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                  {/* List tags */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Active Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span 
                          key={tag.id}
                          className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-mono text-xs capitalize"
                        >
                          #{tag.name.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 4. SETTINGS VIEW */}
            {activeTab === 'settings' && siteSettings && (
              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Site Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure public metadata, footers, logos, and disclosure notices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Site Brand Name</label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Contact Inquiry Email</label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Site SEO Description</label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                    required
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Custom Footer Copyright Statement</label>
                  <input
                    type="text"
                    value={siteSettings.footerText}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Affiliate Compliance Disclosure</label>
                  <textarea
                    value={siteSettings.affiliateDisclosure}
                    onChange={(e) => setSiteSettings({ ...siteSettings, affiliateDisclosure: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Google Analytics 4 Measurement ID (GA4)</label>
                    <input
                      type="text"
                      value={siteSettings.googleAnalyticsId || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })}
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Google Search Console Verification Tag / ID</label>
                    <input
                      type="text"
                      value={siteSettings.googleSearchConsoleVerification || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, googleSearchConsoleVerification: e.target.value })}
                      placeholder="e.g. google-site-verification=XXXXXXXXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                {settingsSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Configuration updated successfully! Dynamic cache refreshed.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Configuration
                </button>
              </form>
            )}

            {/* 5. PASSWORD CHANGE VIEW */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Security Credentials</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Regularly update your admin credentials to prevent unauthorized publishing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Original Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">New Complex Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-500 text-xs">
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-500 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </form>
            )}

            {/* 6. EDITOR VIEW */}
            {activeTab === 'editor' && (
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-xs animate-fade-in">
                <ArticleEditor 
                  articleId={selectedArticleId}
                  categories={categories}
                  tags={tags}
                  onClose={handleEditorClose}
                  getToken={getToken}
                />
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}
