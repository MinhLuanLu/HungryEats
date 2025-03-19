import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserProvider = ({children}) =>{
    const [public_Username, setPublic_Username]                 = useState('')
    const [public_Cart_list, setPublic_Cart_List]               = useState([])
    const [publicEmail, setPublicEmail]                         = useState("")
    const [public_PendingOrder, setPublic_PendingOrder]         = useState([])
    const [pickup_Time, setPickup_Time]                         = useState(null)

    const [public_User_id, setPublic_Userid]                    = useState();
    const [publicCart, setPublicCart]                            = useState({})
    return(
        <UserContext.Provider value={{
            public_Username, setPublic_Username,
            publicEmail, setPublicEmail,
            public_Cart_list, setPublic_Cart_List,
            public_PendingOrder, setPublic_PendingOrder,
            pickup_Time, setPickup_Time,
            
            public_User_id, setPublic_Userid,
            publicCart, setPublicCart
        }}>
            {children}
        </UserContext.Provider>
    )
}
