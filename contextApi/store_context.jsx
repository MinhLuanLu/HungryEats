import { use } from "react";
import { createContext, useState } from "react";

export const StoreContext = createContext({})

export const StoreProvider = ({children}) =>{
    const [publicStore, setPublicStore] = useState({})

    return(
        <StoreContext.Provider value={{
            publicStore, setPublicStore
        }}>
            {children}
        </StoreContext.Provider>
    )
}
