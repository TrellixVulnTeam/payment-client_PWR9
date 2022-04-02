import { useFormContext } from 'react-hook-form';
import { InputSizes } from 'components/StyleGuide/Input';
import TextField from 'components/StyleGuide/TextField';
import { ITextField } from '../types';

const TextInputField: React.FC<ITextField> = ({ onBlur, ...restProps }) => {
  const { name } = restProps;

  const methods = useFormContext();

  const { setValue } = methods;

  const handleOnBlur = (e: any) => {
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
    setValue(name, e.target.value.trim());
  };

  return <TextField size={InputSizes.lg} onBlur={handleOnBlur} {...restProps} />;
};

export default TextInputField;
