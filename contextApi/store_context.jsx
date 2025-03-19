import { createContext, useState } from "react";

export const StoreContext = createContext({})

export const StoreProvider = ({children}) =>{
    const [public_StoreName, setPublic_Store_Name]                      = useState('')
    const [public_Address, setPublic_Address]                           = useState('')
    const [public_Store_Status, setPublic_Store_Status]                 = useState(null)
    const [public_Phone_Number, setPublic_Phone_Number]                 = useState('')
    const [public_store_image, setPublic_store_image]                   = useState("")
    const [public_Store_Order_List, setPublic_Store_Order_List]         = useState([])

    const [publicUpdate_food_quantity, setPublicUpdate_Food_Quantity]               = useState([])

    return(
        <StoreContext.Provider value={{
            public_StoreName, setPublic_Store_Name,
            public_Address, setPublic_Address,
            public_Store_Status, setPublic_Store_Status,
            public_Phone_Number, setPublic_Phone_Number,
            public_Store_Order_List, setPublic_Store_Order_List,
            public_store_image, setPublic_store_image,
            publicUpdate_food_quantity, setPublicUpdate_Food_Quantity
        }}>
            {children}
        </StoreContext.Provider>
    )
}
