import React from 'react';
import ReactDOM from 'react-dom';
import store from 'redux/store';
import { theme } from './configs/theme';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@material-ui/core/styles';
import GlobalStyles from 'components/GlobalStyles';
import CSSBaseLine from 'components/StyleGuide/CSSBaseLine';
import { BreadcrumbsProvider } from 'components/AlopayBreadcrumbs/BreadcrumbsProvider';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_DEBUG === 'false') {
  console.log = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <BreadcrumbsProvider>
            <CSSBaseLine />
            <GlobalStyles />
            <App />
          </BreadcrumbsProvider>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
