import { useContext, createContext } from 'react';

export interface IBreadcrumb {
  to: string;
  label: string;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
}

interface IBreadcrumbsContext {
  breadcrumbs: IBreadcrumb[];
  setBreadcrumbs: (breadcrumbs: IBreadcrumb[]) => void;
}

export const BreadcrumbsContext = createContext<IBreadcrumbsContext>({
  breadcrumbs: [],
  setBreadcrumbs: () => [],
});

export function useBreadcrumbs(): IBreadcrumbsContext {
  return useContext(BreadcrumbsContext);
}
