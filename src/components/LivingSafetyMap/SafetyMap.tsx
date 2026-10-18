import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Plus, 
  List, 
  Map as MapIcon, 
  Lightbulb, 
  Bus, 
  AlertTriangle, 
  Accessibility, 
  Eye, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ThumbsUp, 
  Info,
  Filter,
  Search,
  X,
  MapPin,
  ChevronRight,
  Layers,
  History,
  Compass
} from 'lucide-react';
import { ObservationCategory, ReportStatus, SafetyObservation, SearchableLocation } from '../../types';
import { storageService, normalizeLocationKey } from '../../services/storageService';
import { SEARCHABLE_LOCATIONS } from '../../data/sampleData';
import { SubmitReportModal } from './SubmitReportModal';
import { SafetyListView } from './SafetyListView';

interface SafetyMapProps {
  onOpenSubmitModal?: () => void;
  targetHighlightIssueId?: string | null;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({ targetHighlightIssueId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [observations, setObservations] = useState<SafetyObservation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [targetIssueForModal, setTargetIssueForModal] = useState<SafetyObservation | null>(null);

  // Searchable location state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState<SearchableLocation | null>(null);

  // Load observations and subscribe
  useEffect(() => {
    setObservations(storageService.getObservations());
    const unsubscribe = storageService.subscribe(() => {
      setObservations(storageService.getObservations());
    });
    return unsubscribe;
  }, []);

  // Filter autocomplete suggestions across India
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return SEARCHABLE_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      (loc.aliases && loc.aliases.some(a => a.toLowerCase().includes(q)))
    ).slice(0, 5);
  }, [searchQuery]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || viewMode !== 'map') return;

    if (!mapInstanceRef.current) {
      // Default center: Indiranagar, Bengaluru or selected location
      const initialCoords: [number, number] = selectedLocation 
        ? selectedLocation.coordinates 
        : [12.9716, 77.6412];

      const map = L.map(mapContainerRef.current, {
        center: initialCoords,
        zoom: selectedLocation ? 15 : 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | SAAHARA AI Approximate Observations',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current && viewMode !== 'map') {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode, selectedLocation]);

  // Handle location selection
  const handleSelectLocation = (loc: SearchableLocation) => {
    setSelectedLocation(loc);
    setSearchQuery(loc.name);
    setIsSearchFocused(false);
    setActiveSearchIndex(-1);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.coordinates, 15, { duration: 1.2 });
    }
  };

  const handleClearLocationSearch = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([12.9716, 77.6412], 14, { duration: 1 });
    }
  };

  // Keyboard navigation for search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSearchIndex(i => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSearchIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSearchIndex >= 0 && filteredSuggestions[activeSearchIndex]) {
        handleSelectLocation(filteredSuggestions[activeSearchIndex]);
      } else if (filteredSuggestions.length > 0) {
        handleSelectLocation(filteredSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  // Update map markers when observations, filters, or search location change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || viewMode !== 'map') return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const filtered = observations.filter(obs => {
      const matchCat = selectedCategory === 'all' || obs.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || obs.status === selectedStatus;
      
      let matchLocation = true;
      if (selectedLocation) {
        const normSelected = normalizeLocationKey(selectedLocation.name);
        const normObs = obs.normalizedLocation || normalizeLocationKey(obs.approximateArea);
        matchLocation = Boolean(
          normObs.includes(normSelected) ||
          normSelected.includes(normObs) ||
          (obs.city && selectedLocation.city.toLowerCase() === obs.city.toLowerCase())
        );
      }

      return matchCat && matchStatus && matchLocation;
    });

    filtered.forEach(obs => {
      // Category color & icon
      let color = '#3B82F6';
      let fillCol = '#60A5FA';
      if (obs.category === 'street_lighting') { color = '#CA8A04'; fillCol = '#FDE047'; }
      else if (obs.category === 'public_transport_stop') { color = '#0284C7'; fillCol = '#38BDF8'; }
      else if (obs.category === 'infrastructure_problem') { color = '#E11D48'; fillCol = '#FB7185'; }
      else if (obs.category === 'accessibility') { color = '#0D9488'; fillCol = '#2DD4BF'; }
      else if (obs.category === 'community_observation') { color = '#7C3AED'; fillCol = '#C084FC'; }

      // Special highlight for condition uncertain / needs recheck
      if (obs.status === 'condition_uncertain' || obs.status === 'needs_recheck') {
        color = '#D97706';
        fillCol = '#FBBF24';
      }

      // Uncertainty radius disc
      const circle = L.circle(obs.coordinates, {
        radius: obs.radiusMeters || 160,
        color: color,
        weight: 1.5,
        opacity: 0.6,
        fillColor: fillCol,
        fillOpacity: 0.15,
      });

      // Pin marker
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color}; 
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2.5px solid white; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            color: white;
            font-size: 14px;
            font-weight: bold;
          ">
            ●
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker(obs.coordinates, { icon: customIcon });

      // History timeline items HTML
      const historyHtml = (obs.observationsHistory || []).map(h => `
        <div style="padding: 4px 0; border-top: 1px dashed #E2E8F0; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; color: #64748B;">
            <span>${h.reportedBy || 'Commuter'}</span>
            <span>${h.observedAt}</span>
          </div>
          <div style="color: #334155; margin-top: 2px;">
            ${h.conditionOutcome === 'defective' ? '⚠' : '✓'} ${h.description}
          </div>
        </div>
      `).join('');

      const statusBadge = getStatusBadge(obs.status);
      const popupHtml = `
        <div style="font-family: inherit; min-width: 260px; max-width: 320px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px;">
              ${obs.category.replace(/_/g, ' ')}
            </span>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #ECFDF5; color: #047857;">
              ${statusBadge.label}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 4px; color: #0F172A;">
            ${obs.approximateArea}
          </h4>
          <p style="font-size: 12px; margin: 0 0 6px; color: #334155; line-height: 1.4;">
            ${obs.shortDescription}
          </p>
          
          <!-- History Timeline -->
          <div style="background: #F8FAFC; border-radius: 6px; padding: 6px; margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">
              Observation Timeline (${obs.observationsHistory?.length || 1} entries)
            </div>
            ${historyHtml}
          </div>

          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
            🛡️ Confirmations: <strong>${obs.confirmationsCount} community members</strong>
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="btn-corroborate-${obs.id}" style="
              flex: 1; 
              background: #312E81; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              padding: 5px 8px; 
              font-size: 11px; 
              font-weight: 600; 
              cursor: pointer;
            ">
              + Corroborate
            </button>
            <button id="btn-helpful-${obs.id}" style="
              background: #F1F5F9; 
              color: #1E293B; 
              border: 1px solid #CBD5E1; 
              border-radius: 6px; 
              padding: 5px 8px; 
              font-size: 11px; 
              font-weight: 600; 
              cursor: pointer;
            ">
              👍 (${obs.helpfulCount})
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const corrBtn = document.getElementById(`btn-corroborate-${obs.id}`);
        if (corrBtn) {
          corrBtn.onclick = () => {
            storageService.corroborateObservation(obs.id);
            marker.closePopup();
          };
        }
        const helpBtn = document.getElementById(`btn-helpful-${obs.id}`);
        if (helpBtn) {
          helpBtn.onclick = () => {
            storageService.markObservationHelpful(obs.id);
            marker.closePopup();
          };
        }
      });

      markersGroup.addLayer(circle);
      markersGroup.addLayer(marker);

      // Automatically open target highlighted issue if passed from nearby alert
      if (targetHighlightIssueId && (obs.issueId === targetHighlightIssueId || obs.id === targetHighlightIssueId)) {
        setTimeout(() => {
          marker.openPopup();
        }, 400);
      }
    });
  }, [observations, selectedCategory, selectedStatus, selectedLocation, viewMode, targetHighlightIssueId]);

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Living Safety Map</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              Approximate Public Observations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
            Crowdsourced environmental observations mapped to public landmarks with 100–300m uncertainty buffers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View ({observations.length})</span>
            </button>
          </div>

          {/* Submit Observation CTA */}
          <button
            onClick={() => {
              setTargetIssueForModal(null);
              setIsSubmitModalOpen(true);
            }}
            className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>Submit Observation</span>
          </button>
        </div>
      </div>

      {/* PROMINENT SEARCHABLE LOCATIONS ACROSS INDIA */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs relative z-30">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search Indian locations (e.g. Indira Gandhi Metro, 12th Main, Connaught Place, BKC)..."
              className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={handleClearLocationSearch}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Autocomplete Suggestions Dropdown */}
            {isSearchFocused && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40 max-h-64 overflow-y-auto">
                <div className="p-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 border-b border-slate-100">
                  Searchable Indian Landmarks & Hubs
                </div>
                {filteredSuggestions.map((loc, idx) => (
                  <div
                    key={loc.id}
                    onMouseDown={() => handleSelectLocation(loc)}
                    className={`p-3 cursor-pointer text-xs flex items-center justify-between border-b border-slate-100 last:border-b-0 transition-colors ${
                      idx === activeSearchIndex ? 'bg-indigo-50 text-indigo-950 font-bold' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{loc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-5 block">
                        {loc.city}, {loc.state} • {loc.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Jump to view
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location status badge */}
          {selectedLocation && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-indigo-950">
              <span className="truncate max-w-[200px]">Filter: <strong>{selectedLocation.name}</strong></span>
              <button
                onClick={handleClearLocationSearch}
                className="p-0.5 text-indigo-700 hover:text-indigo-950"
                title="Clear location filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {[
            { id: 'all', label: 'All Observations' },
            { id: 'street_lighting', label: 'Street Lighting' },
            { id: 'public_transport_stop', label: 'Transit Stops' },
            { id: 'infrastructure_problem', label: 'Infrastructure & Walkways' },
            { id: 'accessibility', label: 'Accessibility' },
            { id: 'community_observation', label: 'Community Notes' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Verification States</option>
            <option value="recently_corroborated">Recently Corroborated</option>
            <option value="community_reports_improvement">Community Improvement</option>
            <option value="condition_uncertain">Condition Uncertain / Recheck</option>
            <option value="awaiting_confirmation">Awaiting Confirmation</option>
            <option value="newly_reported">Newly Reported</option>
          </select>
        </div>
      </div>

      {/* Map or List View Content */}
      {viewMode === 'map' ? (
        <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[520px] z-10" 
            style={{ minHeight: '520px' }}
          />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-lg text-[11px] space-y-1.5 pointer-events-auto">
            <span className="font-bold text-slate-900 block text-xs">Observation Map Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
              <span>Street Lighting Condition</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-white" />
              <span>Transit Stop / Crowd Visibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
              <span>Civic Repair / Walkway Barrier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500 border border-white" />
              <span>Pedestrian Accessibility</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              Discs represent 100–300m public landmark uncertainty radius
            </div>
          </div>
        </div>
      ) : (
        <SafetyListView 
          observations={observations.filter(obs => {
            const matchCat = selectedCategory === 'all' || obs.category === selectedCategory;
            const matchStatus = selectedStatus === 'all' || obs.status === selectedStatus;
            let matchLocation = true;
            if (selectedLocation) {
              const normSelected = normalizeLocationKey(selectedLocation.name);
              const normObs = obs.normalizedLocation || normalizeLocationKey(obs.approximateArea);
              matchLocation = Boolean(
                normObs.includes(normSelected) ||
                normSelected.includes(normObs) ||
                (obs.city && selectedLocation.city.toLowerCase() === obs.city.toLowerCase())
              );
            }
            return matchCat && matchStatus && matchLocation;
          })}
          onCorroborate={(id) => storageService.corroborateObservation(id)}
          onMarkHelpful={(id) => storageService.markObservationHelpful(id)}
          onAddObservationToIssue={(obs) => {
            setTargetIssueForModal(obs);
            setIsSubmitModalOpen(true);
          }}
        />
      )}

      {/* Report submission modal */}
      <SubmitReportModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setTargetIssueForModal(null);
        }}
        preselectedLocation={selectedLocation}
        targetExistingIssue={targetIssueForModal}
      />
    </div>
  );
};

export function getStatusBadge(status: ReportStatus) {
  switch (status) {
    case 'recently_corroborated':
      return { label: 'Recently Corroborated', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'condition_uncertain':
    case 'needs_recheck':
      return { label: 'Condition Uncertain / Needs Recheck', bg: 'bg-amber-50 text-amber-900 border-amber-300' };
    case 'awaiting_confirmation':
      return { label: 'Awaiting Confirmation', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
    case 'community_reports_improvement':
      return { label: 'Community Reports Improvement', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
    case 'official_update_available':
      return { label: 'Official Civic Update', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'newly_reported':
      return { label: 'Newly Reported', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'current_condition_unknown':
    default:
      return { label: 'Condition Unknown', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}
