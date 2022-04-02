import { KEY_ACCESS_TOKEN } from 'services/grpc/abstract/gRPCClient';

const setAuthorization = (option: any) => {
  const token = localStorage.getItem(KEY_ACCESS_TOKEN);
  option.headers = { ...option.headers, Authorization: `Bearer ${token}` };
  return option;
};

const fetchApi = async (url: string, body: any, options?: any) => {
  try {
    let optionDefault = {
      method: 'POST',
      body,
    };
    optionDefault = setAuthorization(optionDefault);

    const response = await fetch(url, optionDefault);
    return await response.json();
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

export default fetchApi;
