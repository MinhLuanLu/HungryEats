import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserProvider = ({children}) =>{
    const [public_Username, setPublic_Username]                 = useState('')
    const [public_Cart_list, setPublic_Cart_List]               = useState([])
    const [publicEmail, setPuclicEmail]                         = useState("")
    const [public_Order_Status, setPublic_Order_Status]         = useState([])
    
    return(
        <UserContext.Provider value={{
            public_Username, setPublic_Username,
            publicEmail, setPuclicEmail,
            public_Cart_list, setPublic_Cart_List,
            public_Order_Status, setPublic_Order_Status
        }}>
            {children}
        </UserContext.Provider>
    )
}
