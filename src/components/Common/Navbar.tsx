import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Radio, 
  Share2, 
  HeartHandshake, 
  Search, 
  Sparkles, 
  Phone, 
  Menu, 
  X, 
  User, 
  Settings,
  AlertCircle,
  Bell,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenEmergency: () => void;
  onOpenJudgeTour: () => void;
  onOpenAuth: (initialMode?: 'signin' | 'signup') => void;
  onOpenNearbyAlerts: () => void;
  onToggleRouteChangeDemo: () => void;
  isRouteChangeDemoActive: boolean;
  nearbyAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenEmergency,
  onOpenJudgeTour,
  onOpenAuth,
  onOpenNearbyAlerts,
  onToggleRouteChangeDemo,
  isRouteChangeDemoActive,
  nearbyAlertsCount = 3,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'map', label: 'Living Safety Map', icon: MapPin },
    { id: 'circle', label: 'Saheli Circle', icon: Users },
    { id: 'signal', label: 'Saheli Signal', icon: Radio },
    { id: 'share', label: 'Saheli Share', icon: Share2 },
    { id: 'support', label: 'Support Navigator', icon: HeartHandshake },
    { id: 'tinyfish', label: 'TinyFish Research', icon: Search },
  ];

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner for prototype credibility & demo awareness */}
      <div className="bg-[#1E112A] text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-sm bg-rose-500/20 text-rose-300 font-bold text-[10px] tracking-wide uppercase">
              AZINHACK ’26 Prototype
            </span>
            <span className="hidden sm:inline text-slate-300">
              “Safer journeys. Stronger together.” — Privacy-First Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={onToggleRouteChangeDemo}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
              title="Toggle illustrative route change notification"
            >
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Simulate Route Change {isRouteChangeDemoActive ? '(Active)' : ''}</span>
            </button>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-medium">Area: {currentUser.approximateArea}</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => handleTabClick('overview')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2864] to-[#1E112A] flex items-center justify-center shadow-md p-1.5 group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="SAAHARA AI Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-900 transition-colors">
                  SAAHARA <span className="text-rose-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  v1.1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                Safer journeys. Stronger together.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-950 shadow-xs border border-indigo-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Urgent Helplines Button */}
            <button
              onClick={onOpenEmergency}
              className="px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Access urgent emergency and statutory helplines"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden sm:inline">112 Helplines</span>
              <span className="sm:hidden">112</span>
            </button>

            {/* Nearby Safety Alerts Bell */}
            <button
              onClick={onOpenNearbyAlerts}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors relative"
              title="View consent-based nearby safety alerts"
            >
              <Bell className="w-4 h-4 text-indigo-700" />
              {nearbyAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {nearbyAlertsCount}
                </span>
              )}
            </button>

            {/* SINGLE PROMINENT JUDGE WALKTHROUGH BUTTON */}
            <button
              onClick={onOpenJudgeTour}
              className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-[#3B2864] to-[#201435] hover:from-[#4C3282] hover:to-[#2B1B47] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/20 transition-all hover:scale-105 active:scale-95"
              title="4-Section AZINHACK '26 Judge Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden md:inline">Judge Walkthrough</span>
              <span className="md:hidden">Walkthrough</span>
            </button>

            {/* Sign In & Create Account options */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                title="Sign in to your account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="px-2.5 py-1.5 text-xs font-semibold text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
                title="Create a new privacy-preserving account"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-700" />
                <span>Create Account</span>
              </button>
            </div>

            {/* User Profile / Settings */}
            <button
              onClick={() => handleTabClick('settings')}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Profile & Privacy Settings"
            >
              <User className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-semibold hidden xl:inline max-w-[85px] truncate">
                {currentUser.displayName}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-semibold text-slate-400 px-3 py-1 uppercase">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-950 border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth('signin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-xl text-center"
              >
                Create Account
              </button>
            </div>
            <button
              onClick={() => {
                onOpenNearbyAlerts();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-700" />
              <span>Nearby Safety Alerts ({nearbyAlertsCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
