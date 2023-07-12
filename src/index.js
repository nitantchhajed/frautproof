import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style/main.scss"
import { WagmiConfig, createConfig, configureChains, createStorage } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

export const RACE = {
  id: 90001,
  name: "RACE Testnet",
  network: "RACE",
  iconUrl: "https://i.imgur.com/Q3oIdip.png",
  iconBackground: "#000000",
  nativeCurrency: {
    decimals: 18,
    name: 'ETHEREUM',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ["https://racetestnet.io"]
    },
  },
  blockExplorers: {
    default: { name: "RACE Testnet Explorer", url: "https://testnet.racescan.io" }
  },
  testnet: true

}

const { chains, publicClient } = configureChains(
  [RACE],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] })

    })
  ])

export const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: false,
    }
  }),
];
const config = createConfig({
  autoConnect: true,
  connectors,
  storage: createStorage({ storage: window.localStorage }),
  publicClient,
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
