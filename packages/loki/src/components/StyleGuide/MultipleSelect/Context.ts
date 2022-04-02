import React, { SyntheticEvent } from 'react';

export interface MultipleSelectContextValue {
  name?: string;
  disabled?: boolean;
  selected: string[];
  onChange: (event: SyntheticEvent) => void;
}

const CheckboxGroupContext = React.createContext<MultipleSelectContextValue>({} as MultipleSelectContextValue);

export default CheckboxGroupContext;
