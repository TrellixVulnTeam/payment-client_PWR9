import fetchApi from './fetch';

const HEIMDALL_URL = `${process.env.REACT_APP_HEIMDALL_URL}`;
const UPLOAD_URL = `${HEIMDALL_URL}${process.env.REACT_APP_UPLOAD_URL}`;
const UPLOAD_SERVICE_NAME = `${process.env.REACT_APP_UPLOAD_SERVICE_NAME}`;

export interface UploadMultipleResponseProps<T = any> {
  error: any;
  response: Array<T>;
}

export interface UploadResponseResult {
  fileName: string;
  path: string;
  size: number;
  imageUrl: string;
  fullUrl: string;
}

export interface UploadResponseProps {
  data: {
    baseDirectoryName: string;
    result: UploadResponseResult;
  };
  error: any;
  success: boolean;
}

class UploadResource {
  url: string = '';
  constructor() {
    this.url = UPLOAD_URL;
  }

  async upload(file: File) {
    const data = new FormData();
    data.append('file', file);
    data.append('serviceName', UPLOAD_SERVICE_NAME);

    const response = await fetchApi(this.url, data);
    return response;
  }

  async uploadMulti(files: File[]): Promise<UploadMultipleResponseProps> {
    let error = false;
    const data = await Promise.all(files.map(async (file: File) => await this.upload(file)));

    // check error
    const response = data.map((d) => {
      if (d.error) {
        error = true;
      }
      return d;
    });

    return {
      error,
      response,
    };
  }
}

export default new UploadResource();
