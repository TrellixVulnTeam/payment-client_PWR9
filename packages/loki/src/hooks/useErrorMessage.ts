import { Error } from 'grpc-web';
import { useState } from 'react';
import { getErrorMessageFromCode } from 'utils/constant/message';

function useErrorMessage() {
  const [error, setError] = useState<Error>({
    message: '',
    code: undefined,
  });

  const handleError = (error?: Error) => {
    if (error) {
      setError(error);
    } else {
      setError({
        message: undefined,
        code: undefined,
      });
    }
  };

  return {
    error,
    setError: handleError,
    // If has errorCode then return errorMessage from errorCode
    // If not return default errorMessage
    errorMessage: error.code ? getErrorMessageFromCode(error.code) : error.message,
  };
}

export default useErrorMessage;
