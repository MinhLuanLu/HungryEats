import { createContext, useState } from "react";

export const SocketioContext = createContext({})

export const SocketioProvider = ({children}) =>{
    const [publicSocketio, setPublicSocketio]                      = useState()
  
    return(
        <SocketioContext.Provider value={{
            publicSocketio, setPublicSocketio
        }}>
            {children}
        </SocketioContext.Provider>
    )
}
