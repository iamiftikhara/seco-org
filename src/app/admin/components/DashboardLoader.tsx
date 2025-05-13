import { theme } from '@/config/theme';

export default function DashboardLoader() {
  return (
    <div className="p-6 min-h-[calc(100vh-64px)]" style={{ backgroundColor: theme.colors.background.naturalGray }}>
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-8 w-48 mb-8 rounded" style={{ backgroundColor: theme.colors.background.highlight }}></div>
        
        {/* Stats grid skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="h-32 rounded-lg"
              style={{ backgroundColor: theme.colors.background.highlight }}
            ></div>
          ))}
        </div>
        
        {/* Content area skeleton */}
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.background.highlight }}>
          <div className="h-6 w-36 mb-4 rounded" style={{ backgroundColor: theme.colors.background.naturalGray }}></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <div className="h-4 w-3/4 mb-2 rounded" style={{ backgroundColor: theme.colors.background.naturalGray }}></div>
              <div className="h-3 w-1/2 rounded" style={{ backgroundColor: theme.colors.background.naturalGray }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 