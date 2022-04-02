import { useCallback, useEffect, useState } from 'react';

export default function useImageFallback(sourceOfImage: string, sourceOfFallback?: string): [string, () => void] {
  const [details, setDetails] = useState({
    src: sourceOfImage,
    default: sourceOfImage,
    fallback: sourceOfFallback,
    failed: false,
  });

  const handleOnError = useCallback(() => {
    if (details.failed) {
      return;
    }

    const sourceOfCurrent = details.fallback || details.default;
    setDetails({
      ...details,
      src: sourceOfCurrent,
      failed: true,
    });
  }, [details, setDetails]);

  useEffect(() => {
    const isChangedImage = details.default !== sourceOfImage;
    const isChangedFallback = details.fallback !== sourceOfFallback;
    const isChangedSource = isChangedImage || isChangedFallback;
    if (isChangedSource) {
      const sourceOfCurrent =
        (isChangedImage && sourceOfImage) || (details.failed && isChangedFallback ? sourceOfFallback : details.src);
      setDetails({
        src: sourceOfCurrent,
        default: isChangedImage ? sourceOfImage : details.default,
        fallback: isChangedFallback ? sourceOfFallback : details.fallback,
        failed: isChangedImage ? false : details.failed,
      });
    }
  }, [details, sourceOfImage, sourceOfFallback]);

  return [details.src, handleOnError];
}
