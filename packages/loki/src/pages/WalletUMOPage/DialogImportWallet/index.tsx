import { CryptoWallet } from '@mcuc/stark/ultron_pb';
import { Grid } from '@material-ui/core';
import { t } from 'i18next';
import i18n from 'i18n';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetImportAccount } from 'redux/features/walletBanks/slice';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import StepOneUploadCSV from './StepOneUploadCSV';
import StepTwoReviewUploadedCSV from './StepTwoReviewUploadedCSV';

export interface IUploadedData {
  file: File;
  list: CryptoWallet.AsObject[];
}

interface Props {
  callback: () => void;
}

const steps = [
  { label: i18n.t('Upload'), component: StepOneUploadCSV },
  { label: i18n.t('Preview'), component: StepTwoReviewUploadedCSV },
];
const DialogImportWallet = (props: Props) => {
  const { callback } = { ...props };
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedData, setUploadedData] = useState<IUploadedData>(null);

  const toggleModal = () => setOpen(!open);

  useEffect(() => {
    if (!open) {
      setUploadedData(null);
      setActiveStep(0);
      dispatch(resetImportAccount());
    }
  }, [dispatch, open]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFirst = () => {
    setActiveStep(0);
  };

  const handleUploadFileSuccess = (file, list) => {
    setUploadedData({ file, list });
  };

  const handleCallback = () => {
    if (callback) {
      callback();
    }
  };

  const Component = steps[activeStep].component;
  return (
    <>
      <Button onClick={toggleModal} variant={ButtonVariants.primary} size={ButtonSizes.md}>
        <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
          {t('Import')}
        </Typography>
      </Button>
      <AlopayDialog
        title={t('Import')}
        fullWidth
        open={open}
        onClose={toggleModal}
        activeStep={activeStep}
        steps={steps}
        maxWidth={activeStep === 1 ? 'lg' : 'sm'}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Component
              onNext={handleNext}
              onBack={handleBack}
              onFirst={handleFirst}
              onClose={toggleModal}
              callback={handleCallback}
              // step one
              onFileListChange={handleUploadFileSuccess}
              defaultValue={uploadedData}
            />
          </Grid>
        </Grid>
      </AlopayDialog>
    </>
  );
};

export default DialogImportWallet;
