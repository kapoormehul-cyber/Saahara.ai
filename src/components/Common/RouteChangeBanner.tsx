import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, X, ExternalLink } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const RouteChangeBanner: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsActive(storageService.isRouteChangeDemoActive());
    const unsubscribe = storageService.subscribe(() => {
      setIsActive(storageService.isRouteChangeDemoActive());
    });
    return unsubscribe;
  }, []);

  if (!isActive || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Journey Route Information" className="bg-amber-50/95 border-b border-amber-200/80 px-4 py-3 text-amber-950 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5 sm:mt-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-900">Journey Notice:</span>{' '}
            <span className="text-amber-800">
              Your route appears to have changed. You can review the route or contact your trusted person if you wish.
            </span>
            <span className="block sm:inline text-xs text-amber-700/80 sm:ml-2">
              (Route changes routinely occur due to traffic diversions, roadwork, or navigation re-routing. This notice is neutral and not an accusation.)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => alert("Simulated Action: Opening your navigation route comparison in a neutral preview.")}
            className="px-2.5 py-1 text-xs font-medium bg-amber-200/80 hover:bg-amber-200 text-amber-900 rounded-md transition-colors flex items-center gap-1"
          >
            <span>Review Route</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              storageService.setRouteChangeDemo(false);
              setDismissed(true);
            }}
            className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-200/50 rounded-md transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
