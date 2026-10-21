import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Common/Navbar';
import { RouteChangeBanner } from './components/Common/RouteChangeBanner';
import { FooterDialogs, FooterModalType } from './components/Common/FooterDialogs';
import { EmergencyDrawer } from './components/Common/EmergencyDrawer';
import { JudgeTourModal } from './components/Common/JudgeTourModal';
import { BottomWalkthroughPrompt } from './components/Common/BottomWalkthroughPrompt';
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
  const [investigationTarget, setInvestigationTarget] = useState<{ query: string; approximateArea: string; observationId?: string } | null>(null);

  // Optional Bottom-of-Page Walkthrough Prompt State
  const [showBottomTourPrompt, setShowBottomTourPrompt] = useState(false);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('saahara_walkthrough_prompt_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setCurrentUser(storageService.getUserProfile());
      setIsRouteChangeActive(storageService.isRouteChangeDemoActive());
    });
    return unsubscribe;
  }, []);

  // Monitor reaching actual bottom of main page to show optional walkthrough prompt
  useEffect(() => {
    if (isPromptDismissed || isJudgeTourOpen) {
      setShowBottomTourPrompt(false);
      return;
    }

    const checkBottomPosition = () => {
      try {
        if (sessionStorage.getItem('saahara_walkthrough_prompt_dismissed') === 'true') {
          setIsPromptDismissed(true);
          setShowBottomTourPrompt(false);
          return;
        }
      } catch {
        // ignore
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Only trigger if page is scrollable and user has reached near bottom (within 40px)
      if (docHeight > windowHeight + 60 && scrollY + windowHeight >= docHeight - 40) {
        setShowBottomTourPrompt(true);
      }
    };

    let observer: IntersectionObserver | null = null;
    const sentinel = bottomSentinelRef.current;

    if (sentinel && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            try {
              if (sessionStorage.getItem('saahara_walkthrough_prompt_dismissed') === 'true') {
                setIsPromptDismissed(true);
                setShowBottomTourPrompt(false);
                return;
              }
            } catch {
              // ignore
            }
            setShowBottomTourPrompt(true);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(sentinel);
    }

    window.addEventListener('scroll', checkBottomPosition, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', checkBottomPosition);
    };
  }, [isPromptDismissed, isJudgeTourOpen, activeTab]);

  const handleStartWalkthroughFromPrompt = () => {
    setShowBottomTourPrompt(false);
    setIsPromptDismissed(true);
    try {
      sessionStorage.setItem('saahara_walkthrough_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
    setIsJudgeTourOpen(true);
  };

  const handleSkipWalkthroughPrompt = () => {
    setShowBottomTourPrompt(false);
    setIsPromptDismissed(true);
    try {
      sessionStorage.setItem('saahara_walkthrough_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleManualOpenJudgeTour = () => {
    setShowBottomTourPrompt(false);
    setIsPromptDismissed(true);
    try {
      sessionStorage.setItem('saahara_walkthrough_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
    setIsJudgeTourOpen(true);
  };

  const handleCloseJudgeTour = () => {
    setIsJudgeTourOpen(false);
    setShowBottomTourPrompt(false);
    setIsPromptDismissed(true);
    try {
      sessionStorage.setItem('saahara_walkthrough_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

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
        onOpenJudgeTour={handleManualOpenJudgeTour}
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
            onOpenJudgeTour={handleManualOpenJudgeTour}
            onOpenFooterModal={(type) => setFooterModalType(type)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'overview' && (
          <DashboardOverview
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenJudgeTour={handleManualOpenJudgeTour}
          />
        )}

        {activeTab === 'map' && (
          <SafetyMap 
            targetHighlightIssueId={targetIssueIdForMap} 
            onInvestigateObservation={(obs) => {
              setInvestigationTarget({
                approximateArea: obs.approximateArea,
                query: `${obs.category.replace(/_/g, ' ')}: ${obs.shortDescription}`,
                observationId: obs.issueId || obs.id,
              });
              setActiveTab('tinyfish');
            }}
          />
        )}

        {activeTab === 'circle' && <CommunityFeed currentUser={currentUser} />}

        {activeTab === 'signal' && (
          <SignalBoard
            onInvestigateObservation={(obs) => {
              setInvestigationTarget({
                approximateArea: obs.approximateArea,
                query: `${obs.category.replace(/_/g, ' ')}: ${obs.shortDescription}`,
                observationId: obs.issueId || obs.id,
              });
              setActiveTab('tinyfish');
            }}
          />
        )}

        {activeTab === 'share' && <SaheliShareModule currentUser={currentUser} />}

        {activeTab === 'support' && <SupportNavigatorModule />}

        {activeTab === 'tinyfish' && (
          <TinyFishPanel initialInvestigation={investigationTarget} />
        )}

        {activeTab === 'settings' && (
          <ProfileSettingsView
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
          />
        )}

        {/* Sentinel element to detect reaching the bottom of the page */}
        <div 
          ref={bottomSentinelRef} 
          id="page-bottom-sentinel" 
          className="h-4 w-full pointer-events-none opacity-0" 
          aria-hidden="true" 
        />
      </main>

      {/* Optional subtle bottom-of-page prompt asking if visitor wants guided tour */}
      <BottomWalkthroughPrompt
        isOpen={showBottomTourPrompt && !isJudgeTourOpen}
        onStartWalkthrough={handleStartWalkthroughFromPrompt}
        onSkip={handleSkipWalkthroughPrompt}
      />

      {/* Global Modals */}
      <EmergencyDrawer
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={handleCloseJudgeTour}
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
