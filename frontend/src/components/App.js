import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Clock from "./Clock"
import ProtectedRoute from "../auth_utils/Protection"
import { ContextProvider } from "../auth_utils/AuthContext"

export default function App() {

  return (
    <div>
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/bot" element={<Home />} /> 
            </Route>
            <Route exact path="/" element={<Clock />} />
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </div>
  )
}