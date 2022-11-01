import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import ProtectedRoute from "../auth_utils/Protection"

export default function App() {

  return (
      <div>
        <Router>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/bot" element={<Home />} /> 
              </Route>
              <Route exact path="/" element={<Clock />} />
            </Routes>
        </Router>
      </div>
  )
}
