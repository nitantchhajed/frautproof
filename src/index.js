import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style/main.scss"
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <WagmiConfig config={config}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </WagmiConfig>
);
reportWebVitals();
