import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Bell,
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { BroadCategory, PrivacyPreferences, UserProfile, AgeGroup } from '../types';
import { storageService } from '../services/storageService';
import { CURRENT_USER, SAMPLE_PEERS } from '../data/sampleData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialMode = 'signin', 
  onClose, 
  onLoginSuccess 
}) => {
  // Flow steps: 'credentials' -> 'verify' -> 'onboarding_profile' -> 'onboarding_privacy' -> 'complete'
  const [step, setStep] = useState<'credentials' | 'verify' | 'onboarding_profile' | 'onboarding_privacy'>('credentials');
  const [authType, setAuthType] = useState<'signin' | 'signup' | 'judge_access'>(initialMode);
  
  // Credentials
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);

  // Profile Onboarding
  const [displayName, setDisplayName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('25_34');
  const [category, setCategory] = useState<BroadCategory>('working_professional');
  const [broadField, setBroadField] = useState('Technology & Design');
  const [approximateArea, setApproximateArea] = useState('Indiranagar, Bengaluru');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍💻');

  // Privacy preferences
  const [privacy, setPrivacy] = useState<PrivacyPreferences>({
    shareApproximateAreaOnly: true,
    hideDailyTravelRoutines: true,
    requireMutualConsentForMessages: true,
    strictRideSharingPrivacy: true,
    allowWalkingCompanionDiscovery: true,
    allowAnonymousReports: true,
    enableNearbySafetyAlerts: true,
    alertRadiusKm: 3,
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialMode) {
      setAuthType(initialMode);
    }
  }, [initialMode]);

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Please enter a password with at least 4 characters.');
      return;
    }
    setErrorMessage('');

    if (authType === 'signin') {
      // In sign-in, skip straight to verification step
      setStep('verify');
    } else {
      // In sign-up, go to verify then profile onboarding
      setStep('verify');
    }
  };

  const handleGoogleClick = () => {
    setGoogleNotice(
      'Google Sign-In Notice: OAuth client credentials (GOOGLE_CLIENT_ID) are not configured in this prototype environment. To evaluate without external OAuth keys, use the standard demo email verification or Judge Access.'
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '2601' && otpCode.length < 4) {
      setErrorMessage('Please enter the evaluation demo code: 2601');
      return;
    }
    setErrorMessage('');

    if (authType === 'signin') {
      // Completed sign in
      const existing = storageService.getUserProfile();
      storageService.setAuthSession({ isSignedIn: true, provider: 'demo_email', email: emailOrPhone });
      onLoginSuccess(existing);
      onClose();
    } else {
      // Advance to step 3: profile onboarding
      setStep('onboarding_profile');
    }
  };

  const handleProfileStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage('Please enter a display name or nickname.');
      return;
    }
    if (ageGroup === 'under_18') {
      setErrorMessage('Prototype Restriction: SAAHARA AI is strictly limited to adults (18+) to eliminate adult-minor contact risks.');
      return;
    }
    setErrorMessage('');
    setStep('onboarding_privacy');
  };

  const handleFinishOnboarding = () => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      displayName: displayName.trim() || 'Community Member',
      ageGroup,
      category,
      broadField,
      approximateArea: approximateArea.trim() || 'Central Transit Hub',
      bio: bio.trim() || 'Privacy-conscious community commuter participating in SAAHARA AI.',
      isIdentityVerified: false,
      verificationBadgeDescription: 'Simulated phone OTP verification. Identity documents (Aadhaar/Passport) NOT requested or verified.',
      emailOrPhoneVerified: true,
      verificationMethodNote: 'Phone verification is an anti-spam check. It does not verify identity, gender, or trustworthiness.',
      privacy,
      createdAt: new Date().toISOString(),
    };

    storageService.updateUserProfile(newUser);
    storageService.setOnboardingCompleted(true);
    storageService.setAuthSession({ isSignedIn: true, provider: 'demo_registered', email: emailOrPhone });
    onLoginSuccess(newUser);
    onClose();
  };

  const handleJudgeQuickLogin = (peer: UserProfile) => {
    storageService.updateUserProfile(peer);
    storageService.setOnboardingCompleted(true);
    storageService.setAuthSession({ isSignedIn: true, provider: 'judge_persona', email: `${peer.displayName.toLowerCase().replace(/\s+/g, '')}@demo.local` });
    onLoginSuccess(peer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Tabs */}
        <div className="bg-[#180E28] text-white px-6 pt-5 pb-3">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold">SAAHARA AI Account & Onboarding</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'credentials' && (
            <div className="grid grid-cols-3 gap-1 bg-white/10 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => { setAuthType('signin'); setErrorMessage(''); setGoogleNotice(null); }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  authType === 'signin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => { setAuthType('signup'); setErrorMessage(''); setGoogleNotice(null); }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  authType === 'signup' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
              <button
                onClick={() => { setAuthType('judge_access'); setErrorMessage(''); setGoogleNotice(null); }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  authType === 'judge_access' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Judge Access</span>
              </button>
            </div>
          )}

          {step !== 'credentials' && (
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>
                {step === 'verify' && 'Step 2 of 4: Verification'}
                {step === 'onboarding_profile' && 'Step 3 of 4: Profile Details'}
                {step === 'onboarding_privacy' && 'Step 4 of 4: Privacy & Consent'}
              </span>
              <button
                onClick={() => setStep('credentials')}
                className="text-[11px] text-rose-300 hover:underline"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-50 px-5 py-2 text-xs text-amber-950 border-b border-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <strong>Honest Demo Mode:</strong> Telecom SMS and Google OAuth providers are unconfigured in local demo. Passwords are never stored in plaintext and verification is simulated.
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          {googleNotice && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium leading-relaxed">
              {googleNotice}
            </div>
          )}

          {/* TAB 1: JUDGE QUICK ACCESS */}
          {step === 'credentials' && authType === 'judge_access' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Instantly switch to any evaluated prototype persona with preconfigured privacy settings and sample journeys:
              </div>

              <div className="space-y-2.5">
                <div 
                  onClick={() => handleJudgeQuickLogin(CURRENT_USER)}
                  className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-indigo-950">{CURRENT_USER.displayName} (Primary Demo Persona)</div>
                    <div className="text-xs text-indigo-700">Working Professional • {CURRENT_USER.broadField}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Approx Area: {CURRENT_USER.approximateArea}</div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Select</span>
                </div>

                {SAMPLE_PEERS.slice(0, 2).map((peer) => (
                  <div 
                    key={peer.id}
                    onClick={() => handleJudgeQuickLogin(peer)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{peer.displayName}</div>
                      <div className="text-xs text-slate-600">{peer.category.replace(/_/g, ' ')} • {peer.broadField}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Approx Area: {peer.approximateArea}</div>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold">Switch</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREDENTIALS (SIGN IN / SIGN UP) */}
          {step === 'credentials' && authType !== 'judge_access' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              {/* Google Sign-in demo button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google (Demo Provider)</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Or use email</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. ananya@domain.com or +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{authType === 'signin' ? 'Sign In & Verify' : 'Continue to Verification'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthType('judge_access')}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Evaluating for AZINHACK ’26? Tap here for instant Judge Logins
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VERIFICATION (SIMULATED OTP) */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Verify Security Code</h3>
                <p className="text-xs text-slate-500">
                  Simulated 2FA verification code sent for session: <strong>{emailOrPhone || 'demo-user'}</strong>
                </p>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-center">
                <span className="text-xs text-indigo-900">Evaluation Demo Code:</span>
                <div className="text-xl font-mono font-bold text-indigo-950 tracking-widest mt-0.5">2601</div>
                <button
                  type="button"
                  onClick={() => setOtpCode('2601')}
                  className="mt-1 text-[11px] font-semibold text-indigo-700 underline"
                >
                  Quick Fill Demo Code
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  Enter 4-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="2601"
                  className="w-36 mx-auto text-center font-mono tracking-widest text-lg py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden block"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-normal">
                <strong>Verification Transparency:</strong> Completing this check sets your badge to &quot;Simulated Phone Check&quot;. SAAHARA AI does not treat phone verification as proof of identity or personal trustworthiness.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  {authType === 'signin' ? 'Verify & Enter Dashboard' : 'Verify & Continue Onboarding'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PROFILE ONBOARDING */}
          {step === 'onboarding_profile' && (
            <form onSubmit={handleProfileStepSubmit} className="space-y-3.5">
              <div className="text-xs text-slate-600">
                Set up your public limited profile. Exact addresses and live tracking are permanently prohibited.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name or Nickname (No full legal name required)
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ananya R. or Meera"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age Group (Adult Only)
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                    className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="18_24">18–24 years</option>
                    <option value="25_34">25–34 years</option>
                    <option value="35_49">35–49 years</option>
                    <option value="50_plus">50+ years</option>
                    <option value="under_18">Under 18 (Restricted)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Broad Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BroadCategory)}
                    className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="working_professional">Working Professional</option>
                    <option value="college_student">College Student</option>
                    <option value="school_student">School Student (18+)</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {ageGroup === 'under_18' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Age Restriction:</strong> To protect youth privacy and eliminate adult-minor contact risks, unverified youth registrations are restricted in this prototype.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Broad Study / Work Field (Optional)
                </label>
                <input
                  type="text"
                  value={broadField}
                  onChange={(e) => setBroadField(e.target.value)}
                  placeholder="e.g. Technology, Architecture, Healthcare, Arts"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approximate Neighborhood / Transit Corridor
                </label>
                <input
                  type="text"
                  required
                  value={approximateArea}
                  onChange={(e) => setApproximateArea(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru or South Delhi"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Commute routine or general transit interests..."
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStep('verify')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={ageGroup === 'under_18'}
                  className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Privacy Settings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PRIVACY & CONSENT PREFERENCES */}
          {step === 'onboarding_privacy' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Confirm your data sovereignty and consent preferences before accessing the dashboard:
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.shareApproximateAreaOnly}
                    onChange={(e) => setPrivacy({ ...privacy, shareApproximateAreaOnly: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Share approximate public landmark area only (Zero live GPS tracking)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.requireMutualConsentForMessages}
                    onChange={(e) => setPrivacy({ ...privacy, requireMutualConsentForMessages: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enforce mutual consent before direct messaging unlocks</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.strictRideSharingPrivacy}
                    onChange={(e) => setPrivacy({ ...privacy, strictRideSharingPrivacy: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Selective ride-sharing gate: Always require preview and confirmation</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.enableNearbySafetyAlerts}
                    onChange={(e) => setPrivacy({ ...privacy, enableNearbySafetyAlerts: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enable consent-based nearby safety alerts along transit corridor</span>
                </label>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 leading-relaxed">
                <strong>Storage Disclosure:</strong> Sessions are saved in your local browser state for this prototype. Sensitive data is never transferred to commercial third parties.
              </div>

              <div className="pt-2 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep('onboarding_profile')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Onboarding & Enter Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
