import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserProvider = ({children}) =>{
    const [publicCart, setPublicCart]                            = useState({})
    const [public_PendingOrder, setPublic_PendingOrder]         = useState([])
    const [publicUser, setPublicUser] = useState({})

    
    return(
        <UserContext.Provider value={{
            publicUser, setPublicUser,
            publicCart, setPublicCart,
            public_PendingOrder, setPublic_PendingOrder,
        }}>
            {children}
        </UserContext.Provider>
    )
}
