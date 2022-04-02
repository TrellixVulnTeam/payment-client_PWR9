import { t } from 'i18next';
import { iToast } from '@ilt-core/toast';
import { Grid, Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { loadCryptoWalletsThunk } from 'redux/features/walletUMO/thunks';

import FilterBar from 'components/FilterBar';
import Button from 'components/StyleGuide/Button';
import Option from 'components/StyleGuide/Option';
import Textarea from 'components/StyleGuide/Textarea';
import DropdownList from 'components/StyleGuide/DropdownList';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { InputSizes } from 'components/StyleGuide/Input';
import { useBreadcrumbs, IBreadcrumb } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { APP_NAME, sleep } from 'utils/common';
import { CRYPTO_TYPES, NETWORKS } from 'utils/constant/crypto';

const ConsoleUMO: React.FC = () => {
  const dispatch = useAppDispatch();

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/admin-console/umo',
        label: t('Admin Console'),
      },
      {
        to: '/admin-console/umo',
        label: 'UMO',
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { network: networkParam = -1, crypto_type: cryptoTypeParam = -1 } = urlParams;

  const [networkType, setNetworkType] = useState(+networkParam);
  const [cryptoType, setCryptoType] = useState(+cryptoTypeParam);
  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);
  const [result, setResult] = useState('');

  const handleClearFilter = () => {
    clearUrlParams();
  };

  const handleLoadData = async () => {
    setStatusLoading(StatusEnum.LOADING);
    await sleep(500);
    const { response } = await dispatch(
      loadCryptoWalletsThunk({
        cryptoNetworkType: networkType === -1 ? undefined : networkType,
        cryptoType: cryptoType === -1 ? undefined : cryptoType,
      }),
    ).unwrap();

    if (response) {
      setResult(response.data);
      iToast.success({
        title: t('Success'),
      });
    } else {
      iToast.error({
        title: t('Error'),
        msg: t('Something went wrong. Please re-check.'),
      });
    }

    setStatusLoading(StatusEnum.IDLE);
  };

  const handleChangeCryptoType = (cryptoType) => {
    setCryptoType(cryptoType);
    setUrlParams({
      crypto_type: cryptoType,
    });
  };

  const handleChangeNetworkType = (networkType) => {
    setNetworkType(networkType);
    setUrlParams({
      network: networkType,
    });
  };

  return (
    <>
      <Helmet>
        <title>UMO - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header="UMO Console" maxWidth={false}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <Grid container alignItems="center">
              <Grid item xs={true}>
                <FilterBar
                  onClear={handleClearFilter}
                  list={[
                    {
                      width: { xs: 4, md: 3, lg: 2 },
                      component: (
                        <DropdownList value={cryptoType} onChange={handleChangeCryptoType} size={InputSizes.md}>
                          <Option value={-1}>{t('All')}</Option>
                          {CRYPTO_TYPES.map((cryptoType) => (
                            <Option value={cryptoType.value}>{cryptoType.name}</Option>
                          ))}
                        </DropdownList>
                      ),
                    },
                    {
                      width: { xs: 4, md: 3, lg: 2 },
                      component: (
                        <>
                          <DropdownList value={networkType} onChange={handleChangeNetworkType} size={InputSizes.md}>
                            <Option value={-1}>{t('All')}</Option>
                            {NETWORKS.map((networkType) => (
                              <Option value={networkType.value}>{networkType.name}</Option>
                            ))}
                          </DropdownList>
                        </>
                      ),
                    },
                    {
                      width: { xs: 4, md: 3, lg: 2 },
                      component: (
                        <>
                          <Box width={100}>
                            <Button onClick={handleLoadData} loading={statusLoading === StatusEnum.LOADING}>
                              <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                                {t('Load')}
                              </Typography>
                            </Button>
                          </Box>
                        </>
                      ),
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Textarea value={result} />
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default ConsoleUMO;
