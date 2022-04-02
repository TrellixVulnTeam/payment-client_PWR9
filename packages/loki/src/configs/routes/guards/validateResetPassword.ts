import _get from 'lodash-es/get';
import { getParsedParams } from 'utils/url_helpers';

/**
 * Allow redirect to forgot password flow
 * @param next
 * @returns
 */
const validateResetPassword = ({ next }) => {
  try {
    const queryParams = getParsedParams(window.location.search);
    const rParams = _get(queryParams, '["r"]');
    const splitted = rParams.split('/');
    const email = _get(splitted, '[0]');
    const code = _get(splitted, '[1]');
    const isEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      );
    if (code.length === 6 && isEmail) {
      window.location.href = `/reset-password${window.location.search}`;
      return;
    }
  } catch (e) {}
  next();
};

export default validateResetPassword;
