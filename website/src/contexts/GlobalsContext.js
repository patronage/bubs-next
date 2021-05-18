import React from 'react';

const DEFAULTS = {};

const GlobalsContext = React.createContext(DEFAULTS);

export function GlobalsProvider({ globals, children }) {
  return (
    <GlobalsContext.Provider value={globals}>
      {children}
    </GlobalsContext.Provider>
  );
}

export default GlobalsContext;
