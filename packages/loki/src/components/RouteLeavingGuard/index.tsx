import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';
import DialogDiscard from 'components/Dialog/Discard';

interface Props {
  when?: boolean | undefined;
  navigate: (path: any) => void;
  shouldBlockNavigation: (location: any) => boolean;
}
const RouteLeavingGuard = ({ when, navigate, shouldBlockNavigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    window.onbeforeunload = when ? () => true : null;
    return () => {
      window.onbeforeunload = null;
    };
  }, [when]);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(lastLocation);
    }
  }, [navigate, confirmedNavigation, lastLocation]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      {/* Your own alert/dialog/modal component */}
      <DialogDiscard open={modalVisible} onClose={closeModal} onDiscard={handleConfirmNavigationClick} />
    </>
  );
};

export default RouteLeavingGuard;
