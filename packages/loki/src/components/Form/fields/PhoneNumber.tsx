import _startsWith from 'lodash-es/startsWith';
import _get from 'lodash-es/get';
import PhoneField from 'components/StyleGuide/PhoneNumber';
import { IPhoneNumber } from '../types';
import { t } from 'i18next';

const PhoneNumberField: React.FC<IPhoneNumber> = ({ ...restProps }) => {
  return (
    <PhoneField
      {...restProps}
      searchPlaceholder={t('Search')}
      enableSearch
      value={_get(restProps, 'value.countryCode', '') + _get(restProps, 'value.nationalNumber', '')}
      specialLabel=""
      searchNotFound={t('Not found')}
      enableAreaCodeStretch={true}
      masks={{ vn: '.... ... ....' }}
      preferredCountries={['vn', 'my']}
      country={'vn'}
      onChange={(phone, data) => {
        if (typeof restProps.onChange === 'function') {
          restProps.onChange({
            // @ts-ignore
            target: {
              name: restProps.name,
              value: {
                nationalNumber: phone.slice(data.dialCode.length),
                countryCode: data.dialCode,
              },
            },
          });
        }
      }}
      isValid={(inputNumber, country, countries) => {
        return countries.some((country) => {
          return (
            _startsWith(inputNumber, (country as any).dialCode) || _startsWith((country as any).dialCode, inputNumber)
          );
        });
      }}
    />
  );
};

export default PhoneNumberField;
