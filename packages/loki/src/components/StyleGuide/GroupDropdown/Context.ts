import React, { SyntheticEvent } from 'react';
import { ISelected } from '.';

export interface GroupDropdownContextValue {
  name?: string;
  disabled?: boolean;
  selected: ISelected[];
  onChange: (event: SyntheticEvent) => void;
}

const CheckboxGroupContext = React.createContext<GroupDropdownContextValue>({} as GroupDropdownContextValue);

export default CheckboxGroupContext;
