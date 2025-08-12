import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Responsive.css";
import { useEffect, useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import ReactGA from "react-ga";
import TransactionDetailsPage from "./Pages/TransactionDetailsPage";
import LockAndMint from "./Pages/LockAndMint";
import PoolPage from "./Pages/Pool";
import Claiming from "./Pages/Claiming";
// import ExplorerPage from "./Pages/Explorer";
// import HomePage from "./Pages/Home";

// Web Page
import WebHome from "./Pages/WebPages/WebHome";
import PrivacyPolicy from "./Pages/WebPages/PrivacyPolicy";
import CardPurchase from "./Pages/WebPages/CardPurchase";
import TermsService from "./Pages/WebPages/TermsService";
import Tokenomics from "./Pages/WebPages/Tokenomics";
import YourLiquidityPage from "./Pages/YourLiquidityPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Staking from "./Pages/Staking";

// Solana
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Web3Modal related
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider} from "wagmi";

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

import { ALL_CHAINS } from "./types/chains";
require("@solana/wallet-adapter-react-ui/styles.css");
// import { getWalletConnectInstance } from './walletConnectSetup';

const queryClient = new QueryClient();

const supportedChains = ALL_CHAINS;

const gaTrackingId = "G-0DP30PHL61";
const projectId = "2bcf20e00bc0f72513e22cd16ce9ae83";

export const metadata = { //optional
  name: 'Emmet.Finance',
  description: 'Cross-Chain DeFi solution',
  url: 'https://emmet.finance',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const wagmiAdapter = new WagmiAdapter({
  networks: ALL_CHAINS,
  projectId
});

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: ALL_CHAINS,
  metadata: metadata,
  projectId,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Metamask
    // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
    // '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
    // '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trustwallet ?
  ],
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet']
  }
});

function App() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  useEffect(() => {
    ReactGA.initialize(gaTrackingId);

    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {/* TODO: update tonconnect-manifesto url */}
            <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Emmet-Finance/websitev2/feat/TON/public/tonconnect-manifest.json">
              <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                  <Router
                    // Open all the pages at the top
                    scrollBehavior={() => ({ y: 0 })}
                  >
                    <Routes>
                      <Route path="/" element={<WebHome />} />
                      <Route path="/tokensale" element={<Tokenomics />} />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/terms-of-service"
                        element={<TermsService />}
                      />
                      {/* <Route path="/explorer" element={<ExplorerPage />} /> */}
                      <Route path="/bridge" element={<LockAndMint />} />
                      {/* <Route path="/swap" element={<HomePage />} /> */}
                      <Route path="/pool" element={<PoolPage />} />
                      <Route
                        path="/pool/your-liquidity"
                        element={<YourLiquidityPage />}
                      />
                      <Route
                        path="/claiming"
                        element={<Claiming />}
                      />
                      <Route
                        path="/pay-with-card"
                        element={<CardPurchase />}
                      />
                      <Route
                        path="/transactionDetails/:emmetHash"
                        element={<TransactionDetailsPage />}
                      />

                      <Route path="/staking" element={<Staking />} />
                      
                    </Routes>
                  </Router>
                  </HelmetProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </TonConnectUIProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;

// function WalletConnectWrapper({ children }) {

//   const walletConnectInstance = getWalletConnectInstance();

//   return (
//     <>
//       <WagmiConfig config={walletConnectInstance.wagmiConfig}>
//         {children}
//       </WagmiConfig>
//       <Web3Modal
//         projectId={walletConnectInstance.projectId}
//         ethereumClient={walletConnectInstance.ethereumClient}
//       />
//     </>)

// }

// function BridgeWithWalletConnect() {

//   return (<WalletConnectWrapper>
//     <Bridge />
//   </WalletConnectWrapper>)
// }

// function ExplorerWithWalletConnect() {

//   return (<WalletConnectWrapper>
//     <ExplorerPage />
//   </WalletConnectWrapper>)
// }

// function PoolWithWalletConnect() {

//   return (<WalletConnectWrapper>
//     <PoolPage />
//   </WalletConnectWrapper>)
// }

// function SwapWithWalletConnect() {

//   return (<WalletConnectWrapper>
//     <HomePage />
//   </WalletConnectWrapper>)
// }

// function TransactionDetailsWithWalletConnect() {

//   return (<WalletConnectWrapper>
//     <TransactionDetailsPage />
//   </WalletConnectWrapper>)
// }
