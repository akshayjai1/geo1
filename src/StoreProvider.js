import React from 'react';
const StoreContext = React.createContext();

function StoreProvider({ children }) {
    const [state, setState] = React.useState(initialValue);
    const contextValue = React.useMemo(() => [set, setState], [state]);
    return (
        <StoreContext.Provider>{children}</StoreContext.Provider>
    )
}