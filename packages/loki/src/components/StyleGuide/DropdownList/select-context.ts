import React from 'react';

interface SelectContextValue {
  value: any;
  onChange: (value: any, label: string) => void;
}

const SelectContext = React.createContext<SelectContextValue>(null);
export default SelectContext;
