import React from 'react';

interface Props {}

const Eye = (props: Props) => {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.916 7.6C17.898 2.91 14.1 0 10 0S2.103 2.91.083 7.6a1 1 0 000 .8C2.103 13.09 5.901 16 10 16s7.897-2.91 9.916-7.6a1 1 0 000-.8zM10 14c-3.169 0-6.168-2.29-7.897-6C3.833 4.29 6.83 2 10 2c3.169 0 6.168 2.29 7.897 6-1.73 3.71-4.728 6-7.897 6zm0-10a3.998 3.998 0 00-3.922 4.78 4 4 0 005.452 2.915 3.998 3.998 0 001.297-6.523A3.998 3.998 0 0010 4zm0 6a1.999 1.999 0 110-3.998A1.999 1.999 0 0110 10z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

export default Eye;
