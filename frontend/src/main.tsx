import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/index.css'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Preview from './pages/Preview'
import PublicForm from './pages/PublicForm'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder/:id" element={<Builder />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/f/:id" element={<PublicForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
