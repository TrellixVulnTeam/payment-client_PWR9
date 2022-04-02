import { Backdrop, CircularProgress } from '@material-ui/core';
import { withToast } from '@ilt-core/toast';
import { useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { getAuthThunk } from 'redux/features/auth/thunks';
import ErrorBoundary from 'components/ErrorBoundary';
import NotFoundPage from 'pages/NotFoundPage';
import useAuth from 'hooks/useAuth';
import routes from 'configs/routes';
import history from 'configs/routes/history';
import PrivateRoute from 'configs/routes/private';
import PublicRoute from 'configs/routes/public';
import { HOME, LOGIN } from 'configs/routes/path';
import './App.css';
import './styles/common.scss';

function Authenticating({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const { isFetchingAuth, isAuthenticating } = useAuth();

  useEffect(() => {
    if (isFetchingAuth) {
      dispatch(getAuthThunk());
    }
  }, [dispatch, isFetchingAuth]);

  if (isAuthenticating) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return <>{children}</>;
}

function Routing() {
  const { isAuthenticated } = useAuth();
  return (
    <Router history={history}>
      <ErrorBoundary>
        <Switch>
          {routes.map(({ private: isPrivateMode, ...props }) =>
            isPrivateMode ? <PrivateRoute key={props.path} {...props} /> : <PublicRoute key={props.path} {...props} />,
          )}
          <Route exact path={HOME}>
            <Redirect to={isAuthenticated ? HOME : LOGIN} />
          </Route>
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <Authenticating>
      <Routing />
    </Authenticating>
  );
}

const config = {
  autoClose: 5000,
};

export default withToast(App, config);
