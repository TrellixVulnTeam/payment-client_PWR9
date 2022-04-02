import React from 'react';

interface SelectButtonContextValue {
  value: string;
  onChange: (value: string) => void;
}

const SelectButtonContext = React.createContext<SelectButtonContextValue>(null);
export default SelectButtonContext;
