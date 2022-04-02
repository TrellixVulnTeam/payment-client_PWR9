import { Box, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { CheckCircle } from 'assets/icons/ILT';
import Loading from 'assets/icons/ILT/lib/Loading';
import Upload from 'assets/icons/ILT/lib/Upload';
import Icon from 'components/StyleGuide/Icon';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import React, { useState } from 'react';
import { StatusEnum } from 'redux/constant';
import UploadResource, { UploadResponseProps, UploadResponseResult } from 'services/restful/upload';
import { sleep } from 'utils/common';
import { getErrorMessage } from 'utils/constant/message';
import styles from './styles.module.scss';

interface Props {
  name?: string;
  onChange?: (event) => void;
  value?: UploadResponseResult;
}

const imageTypeAccepted = ['image/png', 'image/jpg', 'image/jpeg'];

const UploadImage = (props: Props) => {
  const { name, onChange, value } = { ...props };
  const inputImage = React.useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState(value || { fileName: '', path: '', size: 0, imageUrl: '', fullUrl: '' });
  const [uploadLoading, setUploadLoading] = React.useState(StatusEnum.IDLE);
  const [errorMessage, setErrorMessage] = React.useState(null);

  function handleShowUpload() {
    if (inputImage && inputImage.current && uploadLoading === StatusEnum.IDLE) {
      inputImage.current.click();
    }
  }

  const handleUploadReceiptPhoto = async (event: any) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    if (!imageTypeAccepted.includes(file.type)) {
      setErrorMessage('The format file is not suitable. Please upload png, jpeg or jpg. Let try again.');
      return;
    }

    setUploadLoading(StatusEnum.LOADING);

    await sleep(500);

    const res: UploadResponseProps = await UploadResource.upload(file);

    if (res.success) {
      const resImage = res.data.result;

      if (resImage) {
        resImage.fullUrl = process.env.REACT_APP_GET_RESOURCE_URL + resImage.path;
      }

      setImage(resImage);
      setErrorMessage(null);
      if (onChange) {
        onChange(resImage);
      }
    } else {
      setImage(null);
      setErrorMessage(getErrorMessage(res.error));
    }
    setUploadLoading(StatusEnum.IDLE);
  };

  return (
    <Grid
      className={styles['root']}
      container
      spacing={1}
      direction="column"
      justifyContent="center"
      onClick={handleShowUpload}
    >
      <input
        name={name}
        id="upload-file"
        ref={inputImage}
        onChange={handleUploadReceiptPhoto}
        accept=".jpeg,.png,.jpg"
        type="file"
        hidden
      />
      <Grid item xs={12}>
        <Paper className={styles['paper']} radius={PaperRadius.bold}>
          <Box p={4}>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Grid container spacing={1} wrap="nowrap" alignItems="center">
                  <Grid item xs="auto">
                    <Icon
                      className={styles['icon-download']}
                      component={StatusEnum.LOADING === uploadLoading ? Loading : Upload}
                    />
                  </Grid>
                  <Grid item xs="auto">
                    <Typography type={TypoTypes.link} weight={TypoWeights.bold} variant={TypoVariants.body1}>
                      {t('Upload image file')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography type={TypoTypes.titleSub} variant={TypoVariants.caption}>
                  {t('Format')}: PNG, JPEG, JPG
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      {(errorMessage || (image && image.fileName)) && (
        <Grid item xs={12}>
          {errorMessage ? (
            <Alert severity="error">{errorMessage}</Alert>
          ) : (
            <Grid item>
              <Box className={styles['box-upload-result']} p={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={10}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Grid container justifyContent="space-between" spacing={1}>
                          <Grid item xs={true}>
                            <Typography type={TypoTypes.sub} truncate={1}>
                              {image.fileName}
                            </Typography>
                          </Grid>
                          {/* <Grid item xs="auto">
                          <Typography type={TypoTypes.success}>{image.fileName ? 100 : 0}%</Typography>
                        </Grid> */}
                        </Grid>
                      </Grid>
                      {/* <Grid item xs={12}>
                      <div
                        className={styles['progress']}
                        style={{
                          width: `${image ? 100 : 0}%`,
                        }}
                      />
                    </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs="auto">
                    <Icon component={CheckCircle} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(UploadImage);
