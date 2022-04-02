import React from 'react'

interface MenuContextValue {
  close: () => void
}

const MenuContext = React.createContext<MenuContextValue>(null)
export default MenuContext
