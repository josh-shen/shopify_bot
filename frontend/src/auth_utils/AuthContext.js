import { createContext, useState } from "react";

export const AuthContext = createContext()

export const ContextProvider = ({children}) => {
    const [auth, setAuth] = useState(null)
    
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}