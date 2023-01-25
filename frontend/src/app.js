import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Clock from "./pages/clock"
import ProtectedRoute from "./auth_utils/protection"
import { ContextProvider } from "./auth_utils/authContext"

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