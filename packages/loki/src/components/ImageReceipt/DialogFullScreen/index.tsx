import React from 'react';
import AlopayDialog from 'components/Dialog';
import styles from './styles.module.scss';
import { t } from 'i18next';

type DialogFullScreenProps = {
  imgUrl: string;
  onClose: () => void;
};

const DialogFullScreen: React.FunctionComponent<DialogFullScreenProps> = ({ imgUrl, onClose }) => {
  return (
    <AlopayDialog
      title={t('Receipt attachment')}
      maxWidth="xl"
      onClose={onClose}
      classes={{ paper: styles['dialog'] }}
      actions={null}
    >
      <div className={styles['image-wrapper']}>
        <img src={imgUrl} alt="receipt attachment" className={styles['image']} />
      </div>
    </AlopayDialog>
  );
};

export default DialogFullScreen;
