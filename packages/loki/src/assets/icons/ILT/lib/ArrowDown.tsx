import React from 'react';

interface Props {}

const ArrowDown = (props: Props) => {
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
        d="M15.5896 10.2441C15.915 10.5695 15.915 11.0972 15.5896 11.4226L10.5896 16.4226C10.2641 16.748 9.73651 16.748 9.41107 16.4226C9.08563 16.0972 9.08563 15.5695 9.41107 15.2441L14.4111 10.2441C14.7365 9.91864 15.2641 9.91864 15.5896 10.2441Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.41107 10.2441C4.73651 9.91864 5.26414 9.91864 5.58958 10.2441L10.5896 15.2441C10.915 15.5695 10.915 16.0972 10.5896 16.4226C10.2641 16.748 9.73651 16.748 9.41107 16.4226L4.41107 11.4226C4.08563 11.0972 4.08563 10.5695 4.41107 10.2441Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowDown;
