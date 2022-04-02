import { Perform } from 'components/AllowedTo';
import { isLegalPermission } from 'components/AllowedTo/utils';
import PageLoader from 'components/PageLoader';
import useAuth from 'hooks/useAuth';
import React, { Suspense } from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { LOGIN, NOT_FOUND } from './path';

// * Override RouteProps -> set "component" is required
interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  layout: React.ComponentType;
  permissions?: Perform;
}

const PrivateRoute = ({ component: Component, permissions = [], layout: Layout, ...rest }: IPrivateRouteProps) => {
  const { isAuthenticated, userPermissions } = useAuth();
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Route
          {...rest}
          render={(props) => {
            // not logged in so redirect to login page with the return url
            if (!isAuthenticated) {
              return (
                <Redirect
                  to={{
                    pathname: LOGIN,
                    state: { from: props.location },
                  }}
                />
              );
            }
            // check if route is restricted by role
            if (!isLegalPermission(permissions, userPermissions, 'or')) {
              // role not authorized so redirect to home page
              return <Redirect to={{ pathname: NOT_FOUND, state: { from: props.location } }} />;
            }
            // authorized so return component
            return <Component {...props} />;
          }}
        />
      </Suspense>
    </Layout>
  );
};

export default PrivateRoute;
