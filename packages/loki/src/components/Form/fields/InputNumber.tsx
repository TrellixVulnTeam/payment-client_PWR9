import MoneyField from 'components/StyleGuide/MoneyField';
import { InputSizes } from 'components/StyleGuide/Input';
import { INumberField } from '../types';

const InputNumberField: React.FC<INumberField> = ({ ...restProps }) => {
  return <MoneyField size={InputSizes.lg} decimalSeparator={false} thousandSeparator={''} suffix={''} {...restProps} />;
};

export default InputNumberField;
