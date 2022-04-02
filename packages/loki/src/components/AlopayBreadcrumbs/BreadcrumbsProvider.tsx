import React, { useState } from 'react';
import { BreadcrumbsContext, IBreadcrumb } from './useBreadcrumbs';

interface BreadcrumbsProviderProps {
  children: React.ReactNode;
}

export function BreadcrumbsProvider({ children }: BreadcrumbsProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumb[]>([]);
  return <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>{children}</BreadcrumbsContext.Provider>;
}
