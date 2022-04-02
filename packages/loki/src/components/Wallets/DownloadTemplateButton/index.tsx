import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import React from 'react';
import { CSVTemplateWalletName } from 'utils/constant/wallet';
import styles from './styles.module.scss';

export const LINK_TEMPLATE_CSV_BANK = '/static/csv/import-bank.csv';
export const LINK_TEMPLATE_CSV_EWALLET = '/static/csv/import-ewallet.csv';
export const LINK_TEMPLATE_CSV_CRYPTO = '/static/csv/import-crypto.csv';
export const LINK_TEMPLATE_CSV_CRYPTO_HOT_WALLET = '/static/csv/import-crypto-hotwallet.csv';

type Props = {
  hrefLink: string;
};

const DownloadTemplateButton: React.FC<Props> = ({ hrefLink }) => {
  return (
    <Typography
      component="a"
      href={hrefLink}
      download={CSVTemplateWalletName}
      variant={TypoVariants.body1}
      type={TypoTypes.link}
      weight={TypoWeights.bold}
      className={styles['link']}
    >
      {t('Download Sample File')}
    </Typography>
  );
};

export default React.memo(DownloadTemplateButton);
