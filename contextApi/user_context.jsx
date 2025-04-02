import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserProvider = ({children}) =>{
    const [publicCart, setPublicCart]                            = useState({})
    const [publicPendingOrder, setPublicPendingOrder]         = useState([])
    const [publicUser, setPublicUser] = useState({})

    
    return(
        <UserContext.Provider value={{
            publicUser, setPublicUser,
            publicCart, setPublicCart,
            publicPendingOrder, setPublicPendingOrder,
        }}>
            {children}
        </UserContext.Provider>
    )
}
