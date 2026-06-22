import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { defaultSiteContent } from '../data/siteContent';

type SiteContent = typeof defaultSiteContent;

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('gsv_site_content');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultSiteContent;
      }
    }
    return defaultSiteContent;
  });

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('gsv_site_content', JSON.stringify(newContent));
  };

  return (
    <SiteContentContext.Provider value={{ content, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
