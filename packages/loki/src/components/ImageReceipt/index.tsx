import { t } from 'i18next';
import React, { useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from 'components/StyleGuide/Icon';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import useImageLoaded, { ImageStatus } from 'hooks/useImageLoaded';
import Loading from 'assets/icons/ILT/lib/Loading';
import DialogFullScreen from './DialogFullScreen';
import styles from './styles.module.scss';

const useStyles = makeStyles<Theme>((theme) => ({
  paperReceipt: {
    height: '270px',
    marginTop: theme.spacing(1),
    background: '#FAFBFF',
  },
  paperReceiptContainerImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperReceiptImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
}));

type ImageReceiptProps = {
  imageUrl: string;
};

const ImageReceipt: React.FunctionComponent<ImageReceiptProps> = ({ imageUrl }) => {
  const classes = useStyles();

  const image = useImageLoaded({ src: imageUrl });

  const [dialog, setDialog] = useState({
    name: '',
    value: undefined,
  });

  const handleOpenFulLScreen = () => {
    setDialog({
      name: 'fullScreen',
      value: undefined,
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      name: '',
      value: undefined,
    });
  };

  return (
    <>
      <Paper className={classes.paperReceipt}>
        <Box className={classes.paperReceiptContainerImage} padding={3} textAlign="center">
          {imageUrl ? (
            <>
              {image.status === ImageStatus.LOADED && (
                <Tooltip title={t('Click to watch full screen')} placement="top" TransitionComponent={Fade}>
                  <Button
                    variant={ButtonVariants.invert}
                    onClick={handleOpenFulLScreen}
                    className={styles['button-receipt']}
                  >
                    <img src={imageUrl} alt="receipt attachment" className={classes.paperReceiptImage} />
                  </Button>
                </Tooltip>
              )}
              {image.status === ImageStatus.LOADING && (
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold} type={TypoTypes.primary}>
                  <Icon className={styles['icon-loading']} component={Loading} />
                </Typography>
              )}
              {image.status === ImageStatus.ERROR && (
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold} type={TypoTypes.sub}>
                  {t(`Can't load image`)}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant={TypoVariants.body2} weight={TypoWeights.bold} type={TypoTypes.sub}>
              {t('Not provided yet')}
            </Typography>
          )}
        </Box>
      </Paper>
      {dialog.name === 'fullScreen' && <DialogFullScreen imgUrl={imageUrl} onClose={handleCloseDialog} />}
    </>
  );
};

export default ImageReceipt;
