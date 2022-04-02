import React, { SyntheticEvent } from 'react';

export interface RadioGroupContextValue {
  name?: string;
  disabled?: boolean;
  selected: string | number;
  onChange: (event: SyntheticEvent) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({} as RadioGroupContextValue);

export default RadioGroupContext;
