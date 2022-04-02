import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt) => {
  if (showExitPrompt) {
    window.onbeforeunload = (event) => {
      if (showExitPrompt) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = '';
        }
        return '';
      }
    };
  } else {
    window.onbeforeunload = null;
  }
};

// Hook
export default function useExitPrompt() {
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt);
  };

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
    return () => {
      window.onbeforeunload = null;
    };
  }, [showExitPrompt]);

  return [showExitPrompt, setShowExitPrompt] as const;
}
