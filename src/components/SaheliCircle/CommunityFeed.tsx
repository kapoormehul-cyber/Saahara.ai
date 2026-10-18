import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  Filter, 
  Info,
  ChevronRight
} from 'lucide-react';
import { CommunityPost, UserProfile, ConnectionRequest } from '../../types';
import { storageService } from '../../services/storageService';
import { UserProfileModal } from './UserProfileModal';
import { ConnectionRequestsDrawer } from './ConnectionRequestsDrawer';
import { PrivateChatModal } from './PrivateChatModal';
import { CreatePostModal } from './CreatePostModal';

interface CommunityFeedProps {
  currentUser: UserProfile;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Modals state
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeChatPeer, setActiveChatPeer] = useState<UserProfile | null>(null);

  useEffect(() => {
    setPosts(storageService.getCommunityPosts());
    setConnections(storageService.getConnectionRequests());

    const unsubscribe = storageService.subscribe(() => {
      setPosts(storageService.getCommunityPosts());
      setConnections(storageService.getConnectionRequests());
    });
    return unsubscribe;
  }, []);

  const handleOpenUserProfile = (authorId: string, authorName: string) => {
    const peer = storageService.getPeerById(authorId) || {
      id: authorId,
      displayName: authorName,
      category: 'college_student' as const,
      broadField: 'Community Member',
      approximateArea: 'Indiranagar Corridor',
      bio: 'Verified community commuter participating in Saheli Circle.',
      isIdentityVerified: false,
      verificationBadgeDescription: 'Simulated phone OTP verified.',
      emailOrPhoneVerified: true,
      verificationMethodNote: 'Simulated phone verification (does not prove identity)',
      privacy: currentUser.privacy,
      createdAt: '2026-09-01',
    };
    setInspectUser(peer);
    setIsProfileModalOpen(true);
  };

  const handleSendConnectionRequest = (targetUser: UserProfile) => {
    storageService.sendConnectionRequest(currentUser, targetUser, 'saheli_circle');
    alert(`Connection request sent to ${targetUser.displayName}. Messaging will unlock upon mutual acceptance.`);
    setIsProfileModalOpen(false);
  };

  const getConnectionState = (peerId: string): 'none' | 'pending' | 'accepted' | 'declined' => {
    const conn = connections.find(
      c => (c.fromUserId === currentUser.id && c.toUserId === peerId) ||
           (c.toUserId === currentUser.id && c.fromUserId === peerId)
    );
    if (!conn || conn.status === 'ended') return 'none';
    return conn.status;
  };

  const pendingIncomingCount = connections.filter(
    c => c.toUserId === currentUser.id && c.status === 'pending'
  ).length;

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'all') return true;
    return post.type === selectedFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Saheli Circle</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
              Nearby Walking Companions & Advice
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Coordinate optional walking companionship from transit hubs and share local public advice. Private messaging is locked behind strict mutual consent.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsRequestsDrawerOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors relative"
          >
            <Users className="w-3.5 h-3.5 text-indigo-700" />
            <span>Connections</span>
            {pendingIncomingCount > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>Request Walking Companion</span>
          </button>
        </div>
      </div>

      {/* Community Guidelines banner */}
      <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-3 text-xs text-indigo-950">
        <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Safe Public Meeting Principle:</strong> Walking companion arrangements should always begin at well-lit, high-visibility public spots (e.g. Metro station concourses or manned bus kiosks). Never arrange initial pickups at private residences.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <span className="font-semibold text-slate-500 mx-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Community Posts' },
          { id: 'walking_companion', label: 'Walking Companions' },
          { id: 'public_meeting_point', label: 'Safe Meeting Spots' },
          { id: 'neighborhood_update', label: 'Civic Updates' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-3.5">
        {filteredPosts.map((post) => {
          const isCurrentUser = post.authorId === currentUser.id;
          const connStatus = getConnectionState(post.authorId);

          return (
            <div 
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              {/* Post Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => handleOpenUserProfile(post.authorId, post.authorName)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-950 cursor-pointer hover:scale-105 transition-transform"
                    title="Inspect limited profile"
                  >
                    {post.authorName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        onClick={() => handleOpenUserProfile(post.authorId, post.authorName)}
                        className="font-bold text-sm text-slate-900 cursor-pointer hover:underline"
                      >
                        {post.authorName}
                      </span>
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {post.authorCategory.replace(/_/g, ' ')}
                      </span>
                      {post.authorField && (
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          • {post.authorField}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {post.createdAt} • Approximate Area: {post.approximateArea}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    post.type === 'walking_companion' 
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : post.type === 'public_meeting_point'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {post.type === 'walking_companion' ? 'Walking Companion Request' : post.type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Content */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{post.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>
              </div>

              {/* Suggested Meeting Point Box */}
              {post.suggestedMeetingPoint && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Suggested Public Meeting Point:</span>
                  </div>
                  <p className="text-slate-600 text-[11px] pl-5">{post.suggestedMeetingPoint}</p>
                  {post.plannedTime && (
                    <div className="text-[10px] text-indigo-700 font-semibold pl-5 pt-0.5">
                      Departure Timing: {post.plannedTime}
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleOpenUserProfile(post.authorId, post.authorName)}
                  className="text-slate-500 hover:text-indigo-900 font-medium flex items-center gap-1"
                >
                  <span>View Limited Profile & Safeguards</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {!isCurrentUser && (
                    connStatus === 'accepted' ? (
                      <button
                        onClick={() => {
                          const peer = storageService.getPeerById(post.authorId);
                          if (peer) setActiveChatPeer(peer);
                        }}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Privately</span>
                      </button>
                    ) : connStatus === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium">
                        Request Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          const peer = storageService.getPeerById(post.authorId) || {
                            id: post.authorId,
                            displayName: post.authorName,
                            category: post.authorCategory,
                            broadField: post.authorField,
                            approximateArea: post.approximateArea,
                            isIdentityVerified: false,
                            verificationBadgeDescription: 'Simulated phone check',
                            emailOrPhoneVerified: true,
                            verificationMethodNote: 'Simulated phone verification (does not prove identity)',
                            privacy: currentUser.privacy,
                            createdAt: '2026-09-01',
                          };
                          handleSendConnectionRequest(peer);
                        }}
                        className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                        <span>Connect to Accompany</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Inspection Modal */}
      <UserProfileModal
        user={inspectUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestConnect={handleSendConnectionRequest}
        connectionStatus={inspectUser ? getConnectionState(inspectUser.id) : 'none'}
        onOpenMessage={(peer) => setActiveChatPeer(peer)}
      />

      {/* Connection Requests Drawer */}
      <ConnectionRequestsDrawer
        isOpen={isRequestsDrawerOpen}
        onClose={() => setIsRequestsDrawerOpen(false)}
        currentUser={currentUser}
        onOpenChatWith={(peerId) => {
          const peer = storageService.getPeerById(peerId);
          if (peer) setActiveChatPeer(peer);
        }}
      />

      {/* Private Chat Modal (Mutual Acceptance Gate Enforced) */}
      <PrivateChatModal
        currentUser={currentUser}
        peerUser={activeChatPeer}
        isOpen={Boolean(activeChatPeer)}
        onClose={() => setActiveChatPeer(null)}
        onEndConnection={() => {
          if (activeChatPeer) {
            const req = connections.find(
              c => (c.fromUserId === currentUser.id && c.toUserId === activeChatPeer.id) ||
                   (c.toUserId === currentUser.id && c.fromUserId === activeChatPeer.id)
            );
            if (req) storageService.updateConnectionStatus(req.id, 'ended');
          }
          setActiveChatPeer(null);
        }}
      />

      {/* Create Walking Companion Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};
