import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import App from "./App"
import './index.css'
import { StateContextProvider } from './context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <ThirdwebProvider activeChain={ChainId.Mumbai}>
        <Router>
         <StateContextProvider>            {/*wrap app in this to be able to use our contracts and all of its functions */}
            <App/>
          </StateContextProvider> 
        </Router>
    </ThirdwebProvider>
)