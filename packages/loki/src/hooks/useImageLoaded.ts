import React from 'react';

export enum ImageStatus {
  ERROR = -1,
  IDLE,
  LOADED,
  LOADING,
}

export default function useImageLoaded({
  crossOrigin,
  referrerPolicy,
  src,
  srcSet,
}: {
  src: string;
  srcSet?: string;
  crossOrigin?: string;
  referrerPolicy?: string;
}) {
  const [status, setStatus] = React.useState(ImageStatus.IDLE);

  React.useEffect(() => {
    let active = true;

    async function doFetch() {
      if (!src && !srcSet) {
        return undefined;
      }
      setStatus(ImageStatus.LOADING);

      const image = new Image();
      image.onload = () => {
        if (!active) {
          return;
        }
        setStatus(ImageStatus.LOADED);
      };
      image.onerror = () => {
        if (!active) {
          return;
        }
        setStatus(ImageStatus.ERROR);
      };
      image.crossOrigin = crossOrigin;
      image.referrerPolicy = referrerPolicy;
      image.src = src;
      if (srcSet) {
        image.srcset = srcSet;
      }
    }

    doFetch();

    return () => {
      active = false;
    };
  }, [crossOrigin, referrerPolicy, src, srcSet]);

  const isLoaded = status === ImageStatus.LOADED;

  return {
    isLoaded,
    status,
  };
}
