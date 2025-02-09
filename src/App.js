import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Responsive.css";
import { useEffect, useMemo } from "react";
import ReactGA from "react-ga";
import TransactionDetailsPage from "./Pages/TransactionDetailsPage";
import LockAndMint from "./Pages/LockAndMint";
import PoolPage from "./Pages/Pool";
// import ExplorerPage from "./Pages/Explorer";
// import HomePage from "./Pages/Home";

// Web Page
import WebHome from "./Pages/WebPages/WebHome";
import PrivacyPolicy from "./Pages/WebPages/PrivacyPolicy";
import TermsService from "./Pages/WebPages/TermsService";
import Tokenomics from "./Pages/WebPages/Tokenomics";
import YourLiquidityPage from "./Pages/YourLiquidityPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

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
import { WagmiProvider, http } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { ALL_CHAINS } from "./types/chains";
require("@solana/wallet-adapter-react-ui/styles.css");
// import { getWalletConnectInstance } from './walletConnectSetup';

const queryClient = new QueryClient();

const supportedChains = ALL_CHAINS;

const gaTrackingId = "G-0DP30PHL61";
const projectId = "2bcf20e00bc0f72513e22cd16ce9ae83";

export const wagmiConfig = defaultWagmiConfig({
  autoConnect: true,
  // connectors: w3mConnectors({ projectId, chains: supportedChains }),
  projectId,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Metamask
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
  ],
  chains: supportedChains,
  transports: supportedChains.reduce((prev, current) => {
    return { ...prev, [current.id]: http() };
  }),
  metadata: {
    name: "Web3Modal",
    description: "Web3Modal",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});

// const ethereumClient = new EthereumClient(wagmiConfig, supportedChains);
createWeb3Modal({ wagmiConfig, projectId, supportedChains });

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
              <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
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
                        path="/transactionDetails/:emmetHash"
                        element={<TransactionDetailsPage />}
                      />
                    </Routes>
                  </Router>
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
