import React from 'react';

interface Props {}

const ArrowUp = (props: Props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0003 3.3335C10.4606 3.3335 10.8337 3.70659 10.8337 4.16683V15.8335C10.8337 16.2937 10.4606 16.6668 10.0003 16.6668C9.54009 16.6668 9.16699 16.2937 9.16699 15.8335V4.16683C9.16699 3.70659 9.54009 3.3335 10.0003 3.3335Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.41107 3.57757C9.73651 3.25214 10.2641 3.25214 10.5896 3.57757L15.5896 8.57757C15.915 8.90301 15.915 9.43065 15.5896 9.75608C15.2641 10.0815 14.7365 10.0815 14.4111 9.75608L9.41107 4.75609C9.08563 4.43065 9.08563 3.90301 9.41107 3.57757Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5896 3.57757C10.915 3.90301 10.915 4.43065 10.5896 4.75609L5.58958 9.75608C5.26414 10.0815 4.73651 10.0815 4.41107 9.75608C4.08563 9.43065 4.08563 8.90301 4.41107 8.57757L9.41107 3.57757C9.73651 3.25214 10.2641 3.25214 10.5896 3.57757Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowUp;
