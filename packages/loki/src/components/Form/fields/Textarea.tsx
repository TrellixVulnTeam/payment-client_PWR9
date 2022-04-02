import { useFormContext } from 'react-hook-form';
import TextareaField from 'components/StyleGuide/TextareaField';
import { InputSizes } from 'components/StyleGuide/Input';
import { ITextareaField } from '../types';

const TextareaInputField: React.FC<ITextareaField> = ({ onBlur, ...restProps }) => {
  const methods = useFormContext();

  const { setValue } = methods;

  const { name } = restProps;

  const handleOnBlur = (e: any) => {
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
    setValue(name, e.target.value.trim());
  };

  return <TextareaField size={InputSizes.lg} multiline={true} onBlur={handleOnBlur} {...restProps} />;
};

export default TextareaInputField;
