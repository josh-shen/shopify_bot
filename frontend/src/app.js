import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Clock from "./pages/Clock"
import About from "./pages/About"
import ProtectedRoute from "./auth_utils/protection"
import { ContextProvider } from "./auth_utils/authContext"

export default function App() {

  return (
    <div>
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute/>}>
              <Route path="/bot" element={<Home/>}/>
              <Route path="/about" element={<About/>}/>
            </Route>
            <Route exact path="/" element={<Clock/>}/>
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </div>
  )
}