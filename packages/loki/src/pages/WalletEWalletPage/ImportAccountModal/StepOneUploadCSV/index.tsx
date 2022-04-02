import React, { useRef, useState } from 'react';
import { CreateSystemEWalletRequest } from '@mcuc/stark/tony_pb';
import { t } from 'i18next';
import { CSVReader } from 'react-papaparse';
import { useDispatch, useSelector } from 'react-redux';
import _get from 'lodash-es/get';
import _isNaN from 'lodash-es/isNaN';
import _isEmpty from 'lodash-es/isEmpty';
import _isNumber from 'lodash-es/isNumber';
import Alert from '@material-ui/lab/Alert';
import { Box, Grid } from '@material-ui/core';

import Icon from 'components/StyleGuide/Icon';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import { isVerifying } from 'redux/features/walletEWallets/slice';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { validateSystemEWalletsThunk } from 'redux/features/walletEWallets/thunks';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import DownloadTemplateButton, { LINK_TEMPLATE_CSV_EWALLET } from 'components/Wallets/DownloadTemplateButton';

import Upload from 'assets/icons/ILT/lib/Upload';
import { CheckCircle } from 'assets/icons/ILT';
import useQuery from 'hooks/useQuery';

import { IUploadedData } from '..';
import styles from './styles.module.scss';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onFileListChange?: (uploadedFile: File, data: CreateSystemEWalletRequest.AsObject[]) => void;
  defaultValue?: IUploadedData;
}

const defaultProps = {
  defaultValue: {
    file: null,
    list: [],
  },
};

const validateRow = (wallet: CreateSystemEWalletRequest.AsObject) => {
  if (!_isNumber(+wallet.balance) || _isNaN(+wallet.balance) || +wallet.balance < 0) return false;
  if (!_isNumber(+wallet.accountId) || _isNaN(+wallet.accountId) || +wallet.accountId < 0) return false;
  if (!_isNumber(+wallet.dailyBalance) || _isNaN(+wallet.dailyBalance) || +wallet.dailyBalance < 0) return false;
  if (!_isNumber(+wallet.dailyUsedAmount) || _isNaN(+wallet.dailyUsedAmount) || +wallet.dailyUsedAmount < 0)
    return false;
  if (!_isNumber(+wallet.dailyBalanceLimit) || _isNaN(+wallet.dailyBalanceLimit) || +wallet.dailyBalanceLimit < 0)
    return false;
  if (!_isNumber(+wallet.accountWalletName) || _isNaN(+wallet.accountWalletName) || +wallet.accountWalletName <= 0)
    return false;
  if (_isEmpty(wallet.accountName)) return false;
  if (_isEmpty(wallet.accountPhoneNumber)) return false;
  return true;
};

const StepOneUploadCSV = (props: Props) => {
  const dispatch = useDispatch();
  const queryParams = useQuery();
  const uploadRef = useRef(null);
  const { onNext, onFileListChange, defaultValue } = { ...defaultProps, ...props };
  const [error, setError] = useState({
    code: undefined,
    message: '',
  });
  const [list, setList] = useState<CreateSystemEWalletRequest.AsObject[]>([...(defaultValue ? defaultValue.list : [])]);
  const [uploadedFile, setUploadedFile] = useState(defaultValue?.file);
  const strMerchantId = queryParams.get('merchant');
  const loading = useSelector(isVerifying);
  const merchants = useSelector(selectDisplayMerchants);
  const merchantSelected = merchants.find((x) => x.id === +strMerchantId) || merchants[0];

  const handleNextStep = async () => {
    const data = await dispatch(
      validateSystemEWalletsThunk({
        recordsList: list,
      }),
    );
    const response = _get(data, 'payload.response');
    if (response) {
      if (onNext) {
        onNext();
      }
    } else {
      setError({
        code: undefined,
        message: t('Something wrong with this file. Try another file'),
      });
    }
  };

  const handleOnDrop = (data = [], file) => {
    if (!merchantSelected) {
      setError({
        code: undefined,
        message: t('No merchant for import'),
      });
      return;
    }

    const FILE_COLUMNS = 8;
    const isNotCorrectFile = file && file.type !== 'text/csv';
    const isNotMatchColumns = data.length > 0 && data[0].meta.fields.length !== FILE_COLUMNS;

    const list = data.map((x) => {
      return {
        merchantId: merchantSelected.id,
        accountId: +x.data[x.meta.fields[0]],
        accountWalletName: +x.data[x.meta.fields[1]],
        accountPhoneNumber: x.data[x.meta.fields[2]],
        accountName: x.data[x.meta.fields[3]],
        balance: +x.data[x.meta.fields[4]],
        dailyBalance: +x.data[x.meta.fields[5]],
        dailyBalanceLimit: +x.data[x.meta.fields[6]],
        dailyUsedAmount: +x.data[x.meta.fields[7]],
      } as CreateSystemEWalletRequest.AsObject;
    });

    const isInvalidData = list.some((item, index) => validateRow(item) === false);

    if (isNotCorrectFile || isNotMatchColumns || isInvalidData) {
      setUploadedFile(null);
      setList([]);
      setError({
        code: undefined,
        message: isNotCorrectFile
          ? t('The format file is not suitable. Please upload CSV. Let try again.')
          : isNotMatchColumns
          ? t('File columns dont match. Please check again')
          : isInvalidData
          ? t('The data you imported is wrong data type or missing')
          : t('Something went wrong. Please re-check.'),
      });
      return;
    }

    setError({
      code: undefined,
      message: '',
    });
    setUploadedFile(file);

    try {
      setList(list);
      if (onFileListChange) {
        onFileListChange(file, list);
      }
    } catch (e) {
      setError({
        code: undefined,
        message: t('Something went wrong!'),
      });
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.error(err, file, inputElem, reason);
  };

  const handleOpenDialog = (e) => {
    if (uploadRef.current) {
      uploadRef.current.open(e);
    }
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          style={{
            dropArea: {
              borderRadius: 8,
              borderStyle: 'solid',
              borderColor: '#D6DEFF',
              backgrounColor: '#FAFBFF',
            },
            dropAreaActive: {
              borderColor: 'red',
            },
            dropFile: {
              width: 100,
              height: 120,
              background: '#ccc',
            },
            fileSizeInfo: {
              color: '#fff',
              backgroundColor: '#000',
              borderRadius: 3,
              lineHeight: 1,
              marginBottom: '0.5em',
              padding: '0 0.4em',
            },
            fileNameInfo: {
              color: '#fff',
              backgroundColor: '#eee',
              borderRadius: 3,
              fontSize: 14,
              lineHeight: 1,
              padding: '0 0.4em',
            },
            removeButton: {
              color: 'blue',
            },
            progressBar: {
              backgroundColor: 'pink',
            },
          }}
          ref={uploadRef}
          noProgressBar
          config={{
            header: true,
            skipEmptyLines: true,
          }}
        >
          {({ file, progressBar: progress }) => (
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Box p={2} className={styles['upload-placeholder']}>
                  <Grid container direction="column" spacing={2} alignItems="center" onClick={handleOpenDialog}>
                    <Grid item xs="auto">
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs="auto">
                          <Icon component={Upload} width={16} />
                        </Grid>
                        <Grid item xs="auto">
                          <Typography type={TypoTypes.link} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                            {t('Upload file')}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs="auto">
                      <Typography type={TypoTypes.sub} variant={TypoVariants.caption}>
                        Format: CSV
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {uploadedFile && (
                <Grid item>
                  <Box className={styles['box-upload-result']} p={2}>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item xs={10}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={8}>
                                <Typography type={TypoTypes.sub} truncate={1}>
                                  {uploadedFile.name}
                                </Typography>
                              </Grid>
                              <Grid item xs="auto">
                                <Typography type={TypoTypes.success}>{uploadedFile ? 100 : 0}%</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <div
                              className={styles['progress']}
                              style={{
                                width: `${uploadedFile ? 100 : 0}%`,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs="auto">
                        <Icon component={CheckCircle} />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              {error.message && (
                <Box mt={2}>
                  <Alert severity="error">{error.message}</Alert>
                </Box>
              )}
            </Grid>
          )}
        </CSVReader>
      </Grid>
      <Grid item>
        <Box pb={2} display="flex" alignItems="center" flexDirection="column">
          <Button
            disabled={list.length === 0}
            size={ButtonSizes.lg}
            fullWidth
            onClick={handleNextStep}
            loading={loading}
          >
            <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
              {t('Next to preview')}
            </Typography>
          </Button>
          <Box mt={2}>
            <DownloadTemplateButton hrefLink={LINK_TEMPLATE_CSV_EWALLET} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StepOneUploadCSV;
