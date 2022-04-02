import { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import AlopayDialog from 'components/Dialog';

import { gRPCaptchaClient } from 'services/grpc/captcha/client';
import ILTInput from 'components/Input';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formImage: {
      width: '100%',
      margin: theme.spacing(1, 0),
      '& img': {
        width: '100%',
      },
    },
    button: {
      marginTop: theme.spacing(2),
    },
  }),
);

type DialogCaptchaProps = {
  open: boolean;
  onClose: () => void;
  onResetPassword: (captcha: { id: string; code: string }) => void;
  loading?: boolean;
};

type FormFields = {
  code: string;
};

const DialogCaptcha = (props: DialogCaptchaProps) => {
  const { open, onClose, onResetPassword, loading } = props;
  const classes = useStyles();

  const [formFields, setFormFields] = useState<FormFields>({
    code: '',
  });
  const [captcha, setCaptcha] = useState({
    id: '',
    image: '',
  });

  useEffect(() => {
    (async () => {
      const { response } = await gRPCaptchaClient.getCaptcha();
      if (response) {
        const { id, data } = response;
        setCaptcha({
          id,
          image: data,
        });
      }
    })();
  }, []);

  const handleSubmit = () => {
    if (captcha.id && formFields.code) {
      onResetPassword({
        id: captcha.id,
        code: formFields.code,
      });
      onClose();
    }
  };

  const handleSaveData = (e: any) => {
    const { value, name } = e.target;
    setFormFields((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AlopayDialog
      title="Security Check"
      open={open}
      onClose={onClose}
      actions={
        <Button
          loading={loading}
          type="button"
          fullWidth
          size={ButtonSizes.lg}
          onClick={handleSubmit}
          className={classes.button}
        >
          Send request
        </Button>
      }
    >
      <Box className={classes.formImage}>
        <img alt="captcha" src={captcha.image} />
      </Box>
      <ILTInput name="code" onChange={handleSaveData} />
    </AlopayDialog>
  );
};

export default DialogCaptcha;
