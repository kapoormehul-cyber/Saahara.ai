import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Common/Navbar';
import { RouteChangeBanner } from './components/Common/RouteChangeBanner';
import { FooterDialogs, FooterModalType } from './components/Common/FooterDialogs';
import { EmergencyDrawer } from './components/Common/EmergencyDrawer';
import { JudgeTourModal } from './components/Common/JudgeTourModal';
import { NearbyAlertsModal } from './components/Common/NearbyAlertsModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { SafetyMap } from './components/LivingSafetyMap/SafetyMap';
import { CommunityFeed } from './components/SaheliCircle/CommunityFeed';
import { SignalBoard } from './components/SaheliSignal/SignalBoard';
import { SaheliShareModule } from './components/SaheliShare/SaheliShareModule';
import { SupportNavigatorModule } from './components/SupportNavigator/SupportNavigatorModule';
import { TinyFishPanel } from './components/TinyFishResearch/TinyFishPanel';
import { ProfileSettingsView } from './components/ProfileSettings/ProfileSettingsView';
import { storageService } from './services/storageService';
import { UserProfile } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isRouteChangeActive, setIsRouteChangeActive] = useState<boolean>(() => storageService.isRouteChangeDemoActive());

  // Global Dialogs & Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isNearbyAlertsOpen, setIsNearbyAlertsOpen] = useState(false);
  const [footerModalType, setFooterModalType] = useState<FooterModalType>(null);
  const [targetIssueIdForMap, setTargetIssueIdForMap] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setCurrentUser(storageService.getUserProfile());
      setIsRouteChangeActive(storageService.isRouteChangeDemoActive());
    });
    return unsubscribe;
  }, []);

  const handleToggleRouteChangeDemo = () => {
    const nextState = !isRouteChangeActive;
    storageService.setRouteChangeDemo(nextState);
    setIsRouteChangeActive(nextState);
  };

  const handleOpenAuth = (initialMode: 'signin' | 'signup' = 'signin') => {
    setAuthInitialMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const handleOpenActionFromTour = (actionKey: string) => {
    if (actionKey === 'open_submit_report') {
      setActiveTab('map');
    } else if (actionKey === 'open_selective_sharing') {
      setActiveTab('share');
    } else if (actionKey === 'open_fare_calc') {
      setActiveTab('share');
    } else if (actionKey === 'open_auth_modal') {
      setIsAuthModalOpen(true);
    } else if (actionKey === 'open_nearby_alerts') {
      setIsNearbyAlertsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FD] text-[#1E1B2E] flex flex-col font-sans selection:bg-[#DDD6FE] selection:text-[#2E1065]">
      {/* Top Navbar with SINGLE prominent Judge Walkthrough button */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenNearbyAlerts={() => setIsNearbyAlertsOpen(true)}
        onToggleRouteChangeDemo={handleToggleRouteChangeDemo}
        isRouteChangeDemoActive={isRouteChangeActive}
        nearbyAlertsCount={3}
      />

      {/* Optional Neutral Route-Change Banner */}
      <RouteChangeBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onExploreDashboard={() => setActiveTab('overview')}
            onFindSupport={() => setActiveTab('support')}
            onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
            onOpenFooterModal={(type) => setFooterModalType(type)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'overview' && (
          <DashboardOverview
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <SafetyMap targetHighlightIssueId={targetIssueIdForMap} />
        )}

        {activeTab === 'circle' && <CommunityFeed currentUser={currentUser} />}

        {activeTab === 'signal' && <SignalBoard />}

        {activeTab === 'share' && <SaheliShareModule currentUser={currentUser} />}

        {activeTab === 'support' && <SupportNavigatorModule />}

        {activeTab === 'tinyfish' && <TinyFishPanel />}

        {activeTab === 'settings' && (
          <ProfileSettingsView
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
          />
        )}
      </main>

      {/* Global Modals */}
      <EmergencyDrawer
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenAction={handleOpenActionFromTour}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('overview');
        }}
      />

      <NearbyAlertsModal
        isOpen={isNearbyAlertsOpen}
        onClose={() => setIsNearbyAlertsOpen(false)}
        currentUser={currentUser}
        onOpenReportDetail={(issueId) => {
          setTargetIssueIdForMap(issueId);
          setActiveTab('map');
        }}
      />

      <FooterDialogs
        activeModal={footerModalType}
        onClose={() => setFooterModalType(null)}
      />
    </div>
  );
}

export default App;
