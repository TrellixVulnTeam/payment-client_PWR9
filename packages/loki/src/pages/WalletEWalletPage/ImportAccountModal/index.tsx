import { Grid } from '@material-ui/core';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import i18n from 'i18n';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetImportAccount } from 'redux/features/walletEWallets/slice';
import StepOneUploadCSV from './StepOneUploadCSV';
import StepTwoReviewUploadedCSV from './StepTwoReviewUploadedCSV';

export interface IAccountFile {
  type: number;
  phoneNumber: string;
  name: string;
  balance: number;
}

export interface IUploadedData {
  file: File;
  list: IAccountFile[];
}

interface Props {
  callback: () => void;
}

const steps = [
  { label: i18n.t('Upload'), component: StepOneUploadCSV },
  { label: i18n.t('Preview'), component: StepTwoReviewUploadedCSV },
];
const ImportAccountModal = (props: Props) => {
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
      <Button onClick={toggleModal} variant={ButtonVariants.secondary} size={ButtonSizes.md}>
        <Typography variant={TypoVariants.button1}>{t('Import')}</Typography>
      </Button>
      <AlopayDialog
        // @ts-ignore
        title={t('Import New Account')}
        fullWidth
        open={open}
        onClose={toggleModal}
        activeStep={activeStep}
        steps={steps}
        maxWidth={activeStep === 1 ? 'xl' : 'sm'}
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

export default ImportAccountModal;
