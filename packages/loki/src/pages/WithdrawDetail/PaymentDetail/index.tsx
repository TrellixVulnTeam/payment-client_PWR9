import React from 'react';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';

import FormInfo from 'components/FormInfo';
import ImageReceipt from 'components/ImageReceipt';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE, getBank, getCrypto, getMethodType } from 'utils/constant/payment';
import { combineCryptoTypeAndNetwork, getCryptoTypeFeeFromNetworkType, getScanTxHash } from 'utils/constant/crypto';

export const columnsDefine = [
  {
    Header: t('Date & time'),
    accessor: 'name',
    width: '200px',
  },
  {
    Header: t('Action'),
    accessor: 'id',
  },
];

type WithdrawInformationProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const WithdrawPaymentDetail: React.FunctionComponent<WithdrawInformationProps> = ({ payment }) => {
  if (!payment) {
    return <></>;
  }

  const paymentMethod = payment.payment.method;
  const banking = payment.paymentDetail?.banking;
  const crypto = payment.paymentDetail?.crypto;

  const contentBank = banking
    ? [
        {
          title: t('Method'),
          value: getMethodType(paymentMethod)?.name,
        },
        {
          title: t('Payer provider'),
          value: getBank(banking.systemBankName)?.name || '-',
        },
        {
          title: t('Payer account'),
          value: banking.systemAccountNumber || '-',
        },
        {
          title: t('Payer name'),
          value: banking.systemAccountName || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(banking.amount || 0) || '-',
        },
        {
          title: `${t('Fee')} (%)`,
          value: _get(payment, 'paymentDetail.banking.fee', '-'),
        },
        {
          title: t('Receipt attachment'),
          value: <ImageReceipt imageUrl={banking.imageUrl} />,
        },
        {
          title: t('TxID'),
          value: banking.txId || '-',
        },
      ]
    : [];

  const contentCrypto = crypto
    ? [
        {
          title: t('Method'),
          value: getMethodType(paymentMethod)?.name,
        },
        {
          title: t('Payer provider'),
          value: getCrypto(crypto.cryptoType)?.name,
        },
        {
          title: t('Payer name'),
          value: combineCryptoTypeAndNetwork(crypto.cryptoType, crypto.cryptoNetworkType),
        },
        {
          title: t('Payer account'),
          value: crypto.senderAddress || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.USDT})`,
          value: crypto.amount || '-',
        },
        {
          title: `${t('Fee')} (${getCryptoTypeFeeFromNetworkType(
            _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
          )})`,
          value: crypto.fee || '-',
        },
        {
          title: t('Receipt attachment'),
          value: <ImageReceipt imageUrl={(crypto as any)?.imageUrl} />,
        },
        {
          title: t('TxHash'),
          value: crypto.txHash ? (
            <Typography
              variant={TypoVariants.body1}
              type={TypoTypes.link}
              weight={TypoWeights.medium}
              component="a"
              href={getScanTxHash(crypto.cryptoNetworkType, crypto.txHash)}
              target="_blank"
              style={{
                wordBreak: 'break-word',
              }}
            >
              {_get(payment, 'paymentDetail.crypto.txHash')}
            </Typography>
          ) : (
            '-'
          ),
        },
      ]
    : [];

  return (
    <>
      <LayoutPaper header={t('Payment detail')}>
        {banking && <FormInfo contents={contentBank} />}
        {crypto && <FormInfo contents={contentCrypto} />}
      </LayoutPaper>
    </>
  );
};

export default WithdrawPaymentDetail;
