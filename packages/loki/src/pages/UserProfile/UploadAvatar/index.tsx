import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import _pick from 'lodash/pick';
import React, { useCallback, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { StatusEnum } from 'redux/constant';
import UploadResource, { UploadResponseProps } from 'services/restful/upload';
import { sleep } from 'utils/common';
import { Crop, getCroppedImg } from 'utils/common/fileHelper';
import { getErrorMessage } from 'utils/constant/message';

interface Props {
  onSubmit?: (e) => void;
}

function CropImage(props: Props) {
  const { onSubmit } = { ...props };
  const [open, toggle] = useState(false);
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState<string>();
  const [crop, setCrop] = useState<any>({ aspect: 1 });
  const inputRef = useRef(null);
  const imgRef = useRef(null);

  const [uploadLoading, setUploadLoading] = React.useState(StatusEnum.IDLE);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => setBase64(reader.result as string));
      reader.readAsDataURL(file);
      toggle(true);
    }
  };

  const onLoad = useCallback((img) => {
    if (img) {
      const min = Math.min(img.width, img.height);
      setCrop({ aspect: 1, width: min * 0.8, height: min * 0.8, x: min * 0.1, y: min * 0.1 });
      imgRef.current = img;
    }
    return false;
  }, []);

  function showFileExpore() {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }

  function handleCloseDialog() {
    toggle(!open);
  }

  async function handleCropAndSave() {
    if (imgRef && imgRef.current) {
      const cropedImage = await getCroppedImg(
        imgRef.current,
        _pick(crop, ['x', 'y', 'width', 'height']) as Crop,
        file?.name,
      );
      handleUpload(cropedImage);
    } else {
      console.log('something when wrong, imgRef with null');
    }
  }

  async function handleUpload(file) {
    if (!file) {
      return;
    }

    setUploadLoading(StatusEnum.LOADING);

    await sleep(500);

    const res: UploadResponseProps = await UploadResource.upload(file);

    if (res.success) {
      const resImage = res.data.result;
      if (onSubmit) {
        onSubmit(resImage);
      }
      handleCloseDialog();
      clearData();
    } else {
      setErrorMessage(getErrorMessage(res.error));
    }
    setUploadLoading(StatusEnum.IDLE);
  }

  function clearData() {
    setFile(null);
    setBase64(null);
  }

  return (
    <>
      {onSubmit && (
        <Button fullWidth onClick={showFileExpore} variant={ButtonVariants.secondary}>
          <Typography variant={TypoVariants.button1}>{t('Replace Your Avatar')}</Typography>
        </Button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onSelectFile} />
      <AlopayDialog title={t('Replace Your Avatar')} open={open} onClose={handleCloseDialog}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <ReactCrop ref={imgRef} src={base64} onImageLoaded={onLoad} crop={crop} onChange={setCrop} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Grid>
          <Grid item>
            <Button size={ButtonSizes.lg} onClick={handleCropAndSave} loading={uploadLoading === StatusEnum.LOADING}>
              {t('Crop & save')}
            </Button>
          </Grid>
        </Grid>
      </AlopayDialog>
    </>
  );
}

export default CropImage;
