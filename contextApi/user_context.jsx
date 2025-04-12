import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserProvider = ({children}) =>{
    const [publicCart, setPublicCart]                            = useState({})
    const [publicPendingOrder, setPublicPendingOrder]         = useState([])
    const [publicUser, setPublicUser] = useState({})
    const [publishableKey, setPublishableKey] = useState() /// the key is suse for the tripe

    
    return(
        <UserContext.Provider value={{
            publicUser, setPublicUser,
            publicCart, setPublicCart,
            publicPendingOrder, setPublicPendingOrder,
            publishableKey, setPublishableKey

        }}>
            {children}
        </UserContext.Provider>
    )
}
