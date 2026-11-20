import React, { useState, useEffect } from 'react';
import {
  X, Lock, Key, Image as ImageIcon, FileText, Settings, Database,
  Trash2, Plus, Check, RefreshCw, AlertCircle, Sparkles, ExternalLink, Users
} from 'lucide-react';
import { PhotoItem, BirthdayContent, WebsiteSettingsData, RegisteredUser } from '../types/index.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  content: BirthdayContent;
  settings: WebsiteSettingsData;
  onUpdatePhotos: (photos: PhotoItem[]) => void;
  onUpdateContent: (content: BirthdayContent) => void;
  onUpdateSettings: (settings: WebsiteSettingsData) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  photos,
  content,
  settings,
  onUpdatePhotos,
  onUpdateContent,
  onUpdateSettings,
}) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('maggie_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('maggie2026');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'photos' | 'content' | 'letter' | 'settings' | 'users' | 'database'>('photos');

  // Form states for content edits
  const [editableContent, setEditableContent] = useState<BirthdayContent>(content);
  const [editableSettings, setEditableSettings] = useState<WebsiteSettingsData>(settings);

  // New photo form state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'polaroid' | 'scrapbook' | 'vogue' | 'ribbon'>('polaroid');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');

  // Mongo status state
  const [mongoUri, setMongoUri] = useState('');
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [showStoredPasswords, setShowStoredPasswords] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const handleCheckDbStatus = async (overrideToken?: string | null) => {
    const activeTok = overrideToken !== undefined ? overrideToken : token;
    try {
      const [statusRes, usersRes] = await Promise.all([
        fetch('/api/db-status'),
        activeTok
          ? fetch('/api/admin/users', {
              headers: { Authorization: `Bearer ${activeTok}` }
            })
          : Promise.resolve(null),
      ]);
      const data = await statusRes.json();
      if (data.success) {
        setDbStatus(data.data);
      }
      if (usersRes) {
        if (usersRes.status === 401) {
          setToken(null);
          localStorage.removeItem('maggie_admin_token');
          setLoginError('Admin session expired. Please sign in again.');
          return;
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success && Array.isArray(usersData.data)) {
            setRegisteredUsers(usersData.data);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      handleCheckDbStatus(token);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        localStorage.setItem('maggie_admin_token', data.data.token);
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setLoginError('Could not reach backend server');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('maggie_admin_token');
  };

  const handleSaveContent = async () => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editableContent)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateContent(data.data);
        setStatusMsg('Content updated successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editableSettings)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.data);
        setStatusMsg('Settings saved successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: newPhotoUrl,
          title: newPhotoTitle || 'New Keepsake Photo',
          caption: newPhotoCaption,
          category: newPhotoCategory,
          location: newPhotoLocation,
          date: 'Just Added'
        })
      });
      const data = await res.json();
      if (data.success) {
        onUpdatePhotos([...photos, data.data]);
        setNewPhotoUrl('');
        setNewPhotoTitle('');
        setNewPhotoCaption('');
        setNewPhotoLocation('');
        setStatusMsg('Photo added successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photograph?')) return;
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        onUpdatePhotos(photos.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckDbStatusTrigger = () => handleCheckDbStatus();

  const handleConnectMongo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mongoUri) return;
    try {
      const res = await fetch('/api/connect-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uri: mongoUri })
      });
      const data = await res.json();
      if (data.success && data.data?.connected) {
        setStatusMsg('Connected to MongoDB Atlas!');
      } else {
        setStatusMsg(data.error || 'Could not connect to MongoDB Atlas.');
      }
      handleCheckDbStatus();
      setTimeout(() => setStatusMsg(''), 5000);
    } catch (err: any) {
      setStatusMsg(`Connection error: ${err.message}`);
    }
  };

  const handleReconnectMongo = async () => {
    try {
      const res = await fetch('/api/reconnect-db', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.connected) {
        setStatusMsg('Connected & synced local users to MongoDB Atlas!');
      } else {
        setStatusMsg(data.error || 'Could not reach MongoDB Atlas.');
      }
      handleCheckDbStatus();
      setTimeout(() => setStatusMsg(''), 5000);
    } catch (err: any) {
      setStatusMsg(`Reconnect error: ${err.message}`);
    }
  };

  const handleVerifyPingWrite = async () => {
    try {
      const res = await fetch('/api/db-verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.pingOk && data.data?.writeVerified) {
        setStatusMsg(`Atlas Ping OK (${data.data.pingLatencyMs}ms) & test document verified (ID: ${data.data.testDocId})`);
      } else {
        setStatusMsg(data.error || 'Ping & test write verification failed.');
      }
      setTimeout(() => setStatusMsg(''), 6000);
    } catch (err: any) {
      setStatusMsg(`Verify error: ${err.message}`);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all photos, letters, and settings to curated editorial defaults?')) return;
    try {
      const res = await fetch('/api/admin/reset-defaults', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] dark:bg-[#18070c] dark:text-[#f5efe6] rounded-2xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-[#871321] text-amber-200">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bodoni font-bold text-lg text-[#F9F6F0]">
                Maggie's Birthday Admin Suite
              </h2>
              <p className="font-mono-split text-[10px] text-stone-400">
                SECURE EDITORIAL &amp; DATABASE CONTROL PANEL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="text-xs font-mono-split text-stone-400 hover:text-white px-2 py-1 rounded bg-stone-800"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Toast Message */}
        {statusMsg && (
          <div className="bg-emerald-600 text-white text-xs font-mono-split py-2 px-6 flex items-center justify-between">
            <span>{statusMsg}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Content Area */}
        {!token ? (
          /* Login Screen */
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#871321] text-amber-200 flex items-center justify-center shadow-xl mb-4 border border-[#D4AF37]/50">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-bodoni text-2xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
              Administrator Authentication
            </h3>
            <p className="font-sans text-xs text-[#584140] dark:text-[#d4c3be] max-w-sm mt-1 mb-6">
              Enter your credentials to manage photographs, greetings, personal letters, and website settings.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username (admin)"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-sm text-[#1c1c18] dark:text-[#f5efe6] focus:outline-none focus:ring-2 focus:ring-[#871321]"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password (maggie2026)"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-sm text-[#1c1c18] dark:text-[#f5efe6] focus:outline-none focus:ring-2 focus:ring-[#871321]"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-600 dark:text-rose-300 font-mono-split">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#871321] hover:bg-[#630011] text-white font-mono-split text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all"
              >
                Access Dashboard
              </button>

              <p className="text-[11px] text-[#8c7170] dark:text-[#a9928d]">
                Default Demo Key: <code className="bg-stone-200 dark:bg-[#2a1118] px-1 py-0.5 rounded text-stone-800 dark:text-[#F3E5AB]">admin</code> / <code className="bg-stone-200 dark:bg-[#2a1118] px-1 py-0.5 rounded text-stone-800 dark:text-[#F3E5AB]">maggie2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard Tabs */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-[#f0eee8] dark:bg-[#120609] border-r border-[#dfbfbe] dark:border-[#3d1c24] p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {[
                { id: 'photos', label: 'Photos Manager', icon: ImageIcon },
                { id: 'content', label: 'Birthday Text', icon: FileText },
                { id: 'letter', label: 'Personal Letter', icon: Sparkles },
                { id: 'settings', label: 'Countdown & Music', icon: Settings },
                { id: 'users', label: 'Visitor Users', icon: Users },
                { id: 'database', label: 'MongoDB Atlas', icon: Database },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'database' || tab.id === 'users') handleCheckDbStatusTrigger();
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono-split font-bold uppercase tracking-wider text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#871321] text-white shadow-sm'
                        : 'text-stone-700 dark:text-[#d4c3be] hover:bg-stone-200 dark:hover:bg-[#240e14]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}

              <div className="mt-auto pt-4 border-t border-[#dfbfbe] dark:border-[#3d1c24] hidden md:block">
                <button
                  onClick={handleResetDefaults}
                  className="w-full py-2 text-[10px] font-mono-split uppercase text-stone-600 dark:text-[#a9928d] hover:text-red-700 dark:hover:text-rose-300 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset All to Defaults</span>
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: PHOTOS */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                      Photo Gallery &amp; Keepsakes ({photos.length})
                    </h3>
                    <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                      Upload or insert photo URLs to update the Vogue spread, Polaroid scrapbook, and Photo Ribbon.
                    </p>
                  </div>

                  {/* Add Photo Form */}
                  <form onSubmit={handleAddPhoto} className="bg-white dark:bg-[#1f0b11] p-4 rounded-xl border border-stone-300 dark:border-[#3d1c24] space-y-3">
                    <span className="text-xs font-mono-split font-bold uppercase text-[#871321] dark:text-[#e67381] block">
                      + Add New Photograph
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newPhotoUrl}
                        onChange={e => setNewPhotoUrl(e.target.value)}
                        placeholder="Image URL (or /src/assets/images/...)"
                        className="px-3 py-2 border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs"
                      />
                      <input
                        type="text"
                        value={newPhotoTitle}
                        onChange={e => setNewPhotoTitle(e.target.value)}
                        placeholder="Title (e.g. Sunset in Positano)"
                        className="px-3 py-2 border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={e => setNewPhotoCaption(e.target.value)}
                        placeholder="Caption description"
                        className="px-3 py-2 border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs"
                      />
                      <input
                        type="text"
                        value={newPhotoLocation}
                        onChange={e => setNewPhotoLocation(e.target.value)}
                        placeholder="Location (e.g. Rome, Italy)"
                        className="px-3 py-2 border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs"
                      />
                      <select
                        value={newPhotoCategory}
                        onChange={e => setNewPhotoCategory(e.target.value as any)}
                        className="px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      >
                        <option value="polaroid">Polaroid Scrapbook</option>
                        <option value="vogue">Vogue Edition</option>
                        <option value="ribbon">Photo Ribbon</option>
                        <option value="scrapbook">Candid Scrapbook</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#871321] text-white text-xs font-mono-split uppercase font-bold rounded hover:bg-[#630011] transition-colors"
                    >
                      Save Photograph
                    </button>
                  </form>

                  {/* Current Photos List */}
                  <div className="space-y-3">
                    {photos.map(photo => (
                      <div
                        key={photo.id}
                        className="bg-white dark:bg-[#1f0b11] p-3 rounded-lg border border-stone-200 dark:border-[#3d1c24] flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={photo.url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded border border-stone-200 dark:border-[#4a222c]"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 dark:text-[#f5efe6] truncate">
                              {photo.title}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-[#d4c3be] truncate">
                              {photo.caption || 'No caption'}
                            </p>
                            <span className="text-[10px] font-mono-split text-[#871321] dark:text-[#e67381] uppercase">
                              {photo.category} · {photo.location || 'Keepsake'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-rose-400 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CONTENT */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                      Editorial Headings &amp; Greetings
                    </h3>
                    <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                      All changes are immediately updated on the live website and synced to MongoDB.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Hero Greeting
                      </label>
                      <input
                        type="text"
                        value={editableContent.heroGreeting}
                        onChange={e => setEditableContent({ ...editableContent, heroGreeting: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Celebration Age
                        </label>
                        <input
                          type="text"
                          value={editableContent.heroAge}
                          onChange={e => setEditableContent({ ...editableContent, heroAge: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Vogue Issue Number
                        </label>
                        <input
                          type="text"
                          value={editableContent.vogueIssueNumber}
                          onChange={e => setEditableContent({ ...editableContent, vogueIssueNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Vogue Headline
                      </label>
                      <input
                        type="text"
                        value={editableContent.vogueHeadline}
                        onChange={e => setEditableContent({ ...editableContent, vogueHeadline: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Vogue Subheadline Deck
                      </label>
                      <textarea
                        rows={2}
                        value={editableContent.vogueSubheadline}
                        onChange={e => setEditableContent({ ...editableContent, vogueSubheadline: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Editorial Quote
                      </label>
                      <input
                        type="text"
                        value={editableContent.quoteText}
                        onChange={e => setEditableContent({ ...editableContent, quoteText: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <button
                      onClick={handleSaveContent}
                      className="px-5 py-2.5 bg-[#871321] text-white font-mono-split text-xs font-bold uppercase tracking-wider rounded hover:bg-[#630011] transition-colors"
                    >
                      Save Editorial Content
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: LETTER */}
              {activeTab === 'letter' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                      Maggie's Personal Keepsake Letter
                    </h3>
                    <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                      This letter appears when the wax seal on the envelope is broken.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Recipient Salutation
                      </label>
                      <input
                        type="text"
                        value={editableContent.letterRecipient}
                        onChange={e => setEditableContent({ ...editableContent, letterRecipient: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Letter Body Prose
                      </label>
                      <textarea
                        rows={8}
                        value={editableContent.letterBody}
                        onChange={e => setEditableContent({ ...editableContent, letterBody: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] font-sans leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Sign-off Phrase
                        </label>
                        <input
                          type="text"
                          value={editableContent.letterSignOff}
                          onChange={e => setEditableContent({ ...editableContent, letterSignOff: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Sender Signature
                        </label>
                        <input
                          type="text"
                          value={editableContent.letterSender}
                          onChange={e => setEditableContent({ ...editableContent, letterSender: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveContent}
                      className="px-5 py-2.5 bg-[#871321] text-white font-mono-split text-xs font-bold uppercase tracking-wider rounded hover:bg-[#630011] transition-colors"
                    >
                      Update Keepsake Letter
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                      Countdown &amp; Music Settings
                    </h3>
                    <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                      Adjust the birthday target date and background music information.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                        Birthday Countdown Target Date &amp; Time (ISO or YYYY-MM-DDTHH:MM)
                      </label>
                      <input
                        type="datetime-local"
                        value={editableSettings.birthdayDate.slice(0, 16)}
                        onChange={e => setEditableSettings({ ...editableSettings, birthdayDate: new Date(e.target.value).toISOString() })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Soundtrack Title
                        </label>
                        <input
                          type="text"
                          value={editableSettings.musicTitle}
                          onChange={e => setEditableSettings({ ...editableSettings, musicTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-split uppercase text-stone-700 dark:text-[#d4c3be] font-bold mb-1">
                          Soundtrack Artist
                        </label>
                        <input
                          type="text"
                          value={editableSettings.musicArtist}
                          onChange={e => setEditableSettings({ ...editableSettings, musicArtist: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] rounded text-xs bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="px-5 py-2.5 bg-[#871321] text-white font-mono-split text-xs font-bold uppercase tracking-wider rounded hover:bg-[#630011] transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: VISITOR USERS */}
              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                        Registered Visitor Accounts ({dbStatus?.usersCount ?? registeredUsers.length})
                      </h3>
                      <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                        {dbStatus?.connected
                          ? `Synced directly with MongoDB Atlas (${dbStatus?.dbName || 'maggies_birthday'}).`
                          : 'Saved in Persistent Local Keepsake Store (auto-syncs to MongoDB Atlas once Atlas IP Whitelist allows 0.0.0.0/0).'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStoredPasswords(prev => !prev)}
                      className="px-3 py-1.5 bg-white dark:bg-[#240e14] border border-stone-300 dark:border-[#4a222c] rounded text-xs font-mono-split font-semibold text-[#871321] dark:text-[#F3E5AB] hover:bg-stone-50 dark:hover:bg-[#31131c] shrink-0"
                    >
                      {showStoredPasswords ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#1f0b11] p-5 rounded-xl border border-stone-300 dark:border-[#3d1c24]">
                    {registeredUsers.length === 0 ? (
                      <p className="text-xs text-stone-500 dark:text-[#a9928d]">
                        No registered visitor accounts yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-stone-200 dark:divide-[#3d1c24]">
                        {registeredUsers.map(u => (
                          <div key={u.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-semibold text-stone-900 dark:text-[#f5efe6] truncate">{u.name}</p>
                              <p className="text-stone-700 dark:text-[#d4c3be] truncate">Email: <span className="font-mono-split">{u.email}</span></p>
                              <p className="font-mono-split text-[11px] text-[#871321] dark:text-[#e67381] truncate">
                                Password: {u.password ? (showStoredPasswords ? u.password : '••••••••') : '(legacy hashed — updates on next login)'}
                              </p>
                            </div>
                            <span className="font-mono-split text-[11px] text-stone-500 dark:text-[#a9928d] shrink-0 tabular-nums">
                              {u.lastLogin
                                ? `Last login ${new Date(u.lastLogin).toLocaleDateString()}`
                                : u.createdAt
                                  ? `Joined ${new Date(u.createdAt).toLocaleDateString()}`
                                  : 'Registered'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: DATABASE */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bodoni text-xl font-bold text-[#1c1c18] dark:text-[#f5efe6]">
                      MongoDB Atlas Connection Status
                    </h3>
                    <p className="text-xs text-[#584140] dark:text-[#d4c3be]">
                      The platform supports dual database modes: instant persistent local store and live cloud MongoDB Atlas.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    dbStatus?.connected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-100'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-100'
                  }`}>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="font-mono-split text-xs font-bold uppercase">
                          {dbStatus?.mode || 'Local Keepsake Store (Active)'}
                        </span>
                      </div>
                      {(dbStatus?.atlasHost || dbStatus?.outboundIp) && (
                        <p className="text-[11px] font-mono-split opacity-85 break-all">
                          {dbStatus?.atlasHost ? `Cluster: ${dbStatus.atlasHost}` : ''}
                          {dbStatus?.dbName ? ` · DB: ${dbStatus.dbName}` : ''}
                          {dbStatus?.outboundIp ? ` · Server Outbound IP: ${dbStatus.outboundIp}` : ''}
                          {dbStatus?.runtimeEnvironment ? ` (${dbStatus.runtimeEnvironment})` : ''}
                        </p>
                      )}
                      <p className="text-xs">
                        {dbStatus?.connected
                          ? 'All photos, letters, wishes, and visitor accounts are persisting directly to MongoDB Atlas!'
                          : `Currently operating in persistent local store mode. All changes are saved locally. Allow ${dbStatus?.outboundIp ? `${dbStatus.outboundIp}/32 or ` : ''}0.0.0.0/0 in Atlas → Network Access → IP Access List, then click Retry Atlas.`}
                      </p>
                      {!dbStatus?.connected && dbStatus?.error && (
                        <p className="text-[11px] font-mono-split text-amber-800/90 dark:text-amber-200/90 break-words">
                          Atlas note: {dbStatus.error}
                        </p>
                      )}
                      {!dbStatus?.connected && dbStatus?.rawError && (
                        <p className="text-[10px] font-mono-split text-amber-900/80 dark:text-amber-200/90 bg-amber-100/70 dark:bg-amber-900/40 p-2 rounded border border-amber-200 dark:border-amber-700/50 break-all">
                          Underlying error: {dbStatus.rawError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {dbStatus?.connected && (
                        <button
                          onClick={handleVerifyPingWrite}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-mono-split font-bold shadow-sm hover:bg-emerald-800 transition-colors"
                        >
                          Verify Ping &amp; Write
                        </button>
                      )}
                      {!dbStatus?.connected && dbStatus?.hasAtlasConfigured && (
                        <button
                          onClick={handleReconnectMongo}
                          className="px-3 py-1.5 bg-[#871321] text-white rounded text-xs font-mono-split font-bold shadow-sm hover:bg-[#630011] transition-colors"
                        >
                          Retry Atlas
                        </button>
                      )}
                      <button
                        onClick={handleCheckDbStatusTrigger}
                        className="px-3 py-1.5 bg-white dark:bg-[#240e14] border border-stone-300 dark:border-[#4a222c] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs font-mono-split flex items-center gap-1 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* Connect Atlas Form */}
                  <form onSubmit={handleConnectMongo} className="bg-white dark:bg-[#1f0b11] p-5 rounded-xl border border-stone-300 dark:border-[#3d1c24] space-y-3">
                    <span className="text-xs font-mono-split font-bold uppercase text-[#871321] dark:text-[#e67381] block">
                      Connect to MongoDB Atlas
                    </span>
                    <p className="text-xs text-stone-600 dark:text-[#d4c3be]">
                      Format: <code className="bg-stone-100 dark:bg-[#120609] px-1 py-0.5 rounded text-[11px]">mongodb+srv://username:password@cluster.mongodb.net/maggies_birthday</code>
                    </p>

                    <input
                      type="password"
                      value={mongoUri}
                      onChange={e => setMongoUri(e.target.value)}
                      placeholder="Paste your MongoDB Atlas Connection String here..."
                      className="w-full px-3 py-2 border border-stone-300 dark:border-[#4a222c] bg-white dark:bg-[#120609] text-[#1c1c18] dark:text-[#f5efe6] rounded text-xs font-mono-split"
                    />

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#1A1A1A] dark:bg-[#871321] hover:bg-[#871321] dark:hover:bg-[#630011] text-white font-mono-split text-xs font-bold uppercase tracking-wider rounded transition-colors"
                    >
                      Connect &amp; Sync Atlas Cluster
                    </button>
                  </form>

                  {/* Registered Visitor Accounts */}
                  <div className="bg-white dark:bg-[#1f0b11] p-5 rounded-xl border border-stone-300 dark:border-[#3d1c24] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono-split font-bold uppercase text-[#871321] dark:text-[#e67381]">
                        Registered Visitor Accounts ({dbStatus?.usersCount ?? registeredUsers.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowStoredPasswords(prev => !prev)}
                        className="text-[11px] font-mono-split text-[#871321] dark:text-[#F3E5AB] hover:underline"
                      >
                        {showStoredPasswords ? 'Hide Passwords' : 'Show Passwords'}
                      </button>
                    </div>
                    {registeredUsers.length === 0 ? (
                      <p className="text-xs text-stone-500 dark:text-[#a9928d]">
                        No registered visitor accounts yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-stone-200 dark:divide-[#3d1c24] max-h-52 overflow-y-auto">
                        {registeredUsers.map(u => (
                          <div key={u.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                            <div className="min-w-0">
                              <p className="font-semibold text-stone-900 dark:text-[#f5efe6] truncate">{u.name}</p>
                              <p className="text-stone-600 dark:text-[#d4c3be] truncate">{u.email}</p>
                              {u.password && (
                                <p className="font-mono-split text-[11px] text-stone-500 dark:text-[#a9928d] mt-0.5 truncate">
                                  Password: {showStoredPasswords ? u.password : '••••••••'}
                                </p>
                              )}
                            </div>
                            <span className="font-mono-split text-[11px] text-stone-500 dark:text-[#a9928d] shrink-0 tabular-nums">
                              {u.lastLogin
                                ? `Last login ${new Date(u.lastLogin).toLocaleDateString()}`
                                : u.createdAt
                                  ? `Joined ${new Date(u.createdAt).toLocaleDateString()}`
                                  : 'Registered'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
