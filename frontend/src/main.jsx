import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {SocketProvider} from "./util/SocketProvider";
import { Toaster } from "sonner";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
    <App />
    <Toaster richColors position="top-center" /> 
    </SocketProvider>
  </StrictMode>
)
