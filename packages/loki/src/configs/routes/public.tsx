import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import React, { Suspense } from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { STATISTICS } from './path';

// * Override RouteProps -> set "component" is required
interface IPublicRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  layout: React.ComponentType<any>;
  restricted?: boolean;
}

const PublicRoute = ({ component: Component, restricted = false, layout: Layout, ...rest }: IPublicRouteProps) => {
  const { isAuthenticated } = useAuth();
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Route
          {...rest}
          render={(props) =>
            isAuthenticated && restricted ? <Redirect to={STATISTICS} /> : <Component {...props} />
          }
        />
      </Suspense>
    </Layout>
  );
};

export default PublicRoute;
