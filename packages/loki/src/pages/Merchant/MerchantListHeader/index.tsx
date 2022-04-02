import Grid from 'components/StyleGuide/Grid';
import Icon from 'components/StyleGuide/Icon';
import Input from 'components/StyleGuide/Input';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Search } from 'assets/icons/ILT';
import { useTranslation } from 'react-i18next';

interface Props {}

const MerchantListHeader = (props: Props) => {
  const { t } = useTranslation();

  const [urlParams, setUrlParams] = useUpdateUrlParams();
  const { keyword: keywordParam } = urlParams;
  const [keyword, setKeyword] = useState(keywordParam || '');

  const handleKeywordChange = (e) => {
    const { value } = e.target;
    setKeyword(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitKeyword();
    }
  };

  const submitKeyword = () => {
    setUrlParams({ keyword, period: '' });
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" className={styles['root']}>
      <Grid item xs="auto">
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
          {t('Merchant')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Input
          value={keyword}
          placeholder={t('Search')}
          afterInput={
            <InputAdornment onClick={submitKeyword}>
              <Icon className={styles['search-icon']} component={Search} />
            </InputAdornment>
          }
          onChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
        />
      </Grid>
    </Grid>
  );
};

export default MerchantListHeader;
