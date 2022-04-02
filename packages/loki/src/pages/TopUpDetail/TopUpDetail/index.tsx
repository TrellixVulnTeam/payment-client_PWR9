import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import React from 'react';
import _get from 'lodash-es/get';
import { t } from 'i18next';

import FormInfo from 'components/FormInfo';
import StatusReceipt from 'components/Status/Receipt';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { formatCurrency } from 'utils/common';
import { combineCryptoTypeAndNetwork, getCryptoTypeFeeFromNetworkType, getScanTxHash } from 'utils/constant/crypto';
import {
  getBank,
  getCrypto,
  getEWallet,
  getMethodType,
  CURRENCY_TYPE,
  getTelco,
  getListCheckPaymentMethod,
} from 'utils/constant/payment';

type TopUpInformationProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const TopUpInformation: React.FunctionComponent<TopUpInformationProps> = ({ payment }) => {
  const method = _get(payment, 'payment.method');

  const { isBank, isCrypto, isEWallet, isTelco } = getListCheckPaymentMethod(method);

  const walletContents = isEWallet
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: t('Provider'),
          value: getEWallet(payment.paymentDetail?.eWallet?.eWalletName)?.name || '-',
        },
        {
          title: t('Payee account'),
          value: payment.paymentDetail?.eWallet?.systemAccountPhoneNumber || '-',
        },
        {
          title: t('Payee name'),
          value: payment.paymentDetail?.eWallet?.systemAccountName || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(payment.paymentDetail?.eWallet?.amount) || '-',
        },
        {
          title: t('Payment code'),
          value: payment.paymentDetail?.eWallet.paymentCode || '-',
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment.status} />,
        },
      ]
    : [];

  const bankContents = isBank
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: t('Provider'),
          value: getBank(payment.paymentDetail?.banking?.merchantUserBankName)?.name || '-',
        },
        {
          title: t('Payer account'),
          value: payment.paymentDetail?.banking?.merchantUserAccountNumber || '-',
        },
        {
          title: t('Payer name'),
          value: payment.paymentDetail?.banking?.merchantUserAccountName || '-',
        },
        {
          title: t('Payee account'),
          value: payment.paymentDetail?.banking?.systemAccountNumber || '-',
        },
        {
          title: t('Payee name'),
          value: payment.paymentDetail?.banking?.systemAccountName || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(payment.paymentDetail.banking.amount) || '-',
        },
        {
          title: t('Payment code'),
          value: payment.paymentDetail?.banking?.paymentCode || '-',
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment.status} />,
        },
      ]
    : [];

  const telcoContents = isTelco
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: t('Provider'),
          value: getTelco(payment.paymentDetail?.telco?.telcoName)?.name || '-',
        },
        {
          title: t('Card ID'),
          value: payment.paymentDetail?.telco?.cardId || '-',
        },
        {
          title: t('Series number'),
          value: payment.paymentDetail?.telco?.serialNumber || '-',
        },
        {
          title: `${t('Value')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(payment.paymentDetail?.telco?.amount) || '-',
        },
        {
          title: `${t('Charged amount')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(payment.paymentDetail?.telco?.chargedAmount) || '-',
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment.status} />,
        },
      ]
    : [];

  const cryptoContents = isCrypto
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: t('Provider'),
          value: getCrypto(payment.paymentDetail.crypto.cryptoWalletName)?.name || '-',
        },
        {
          title: t('Payer account'),
          value: _get(payment, 'paymentDetail.crypto.senderAddress') || '-',
        },
        {
          title: t('Payer name'),
          value:
            combineCryptoTypeAndNetwork(
              _get(payment, 'paymentDetail.crypto.cryptoType'),
              _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
            ) || '-',
        },
        {
          title: t('Payee account'),
          value: _get(payment, 'paymentDetail.crypto.receiverAddress') || '-',
        },
        {
          title: t('Payee name'),
          value:
            combineCryptoTypeAndNetwork(
              _get(payment, 'paymentDetail.crypto.cryptoType'),
              _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
            ) || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.USDT})`,
          value: _get(payment, 'paymentDetail.crypto.amount') || '-',
        },
        {
          title: `${t('Fee')} (${getCryptoTypeFeeFromNetworkType(
            _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
          )})`,
          value: _get(payment, 'paymentDetail.crypto.fee') || '-',
        },
        {
          title: t('TxHash'),
          value: _get(payment, 'paymentDetail.crypto.txHash') ? (
            <Typography
              variant={TypoVariants.body1}
              type={TypoTypes.link}
              weight={TypoWeights.medium}
              component="a"
              href={getScanTxHash(
                _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
                _get(payment, 'paymentDetail.crypto.txHash'),
              )}
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
        {
          title: null,
          value: null,
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={_get(payment, 'payment.status')} />,
        },
      ]
    : [];

  return (
    <LayoutPaper header={t('Top-up detail')}>
      {isEWallet && <FormInfo contents={walletContents} />}
      {isBank && <FormInfo contents={bankContents} />}
      {isTelco && <FormInfo contents={telcoContents} />}
      {isCrypto && <FormInfo contents={cryptoContents} />}
    </LayoutPaper>
  );
};

export default TopUpInformation;
