import React from "react";
import { Helmet } from "react-helmet-async";
import HeaderNotify from "../../HeaderFooterSidebar/WebHeaderFooter/HeaderComponents/HeaderNotify"
import WebHeader from "../../HeaderFooterSidebar/WebHeaderFooter/WebHeader";
import WebFooter from "../../HeaderFooterSidebar/WebHeaderFooter/WebFooter";
import IntroducingEMMET from "./TokenomicsComponents/IntroducingEMMET";
import TokenomicsBox from "./TokenomicsComponents/TokenomicsBox";
import Distribution from "./TokenomicsComponents/Distribution";
import BorderLine from "../../assets/img/web/Tokenomics/line.png";
import "./Tokenomics.css";

export default function Tokenomics() {

  return (
    <>
      <Helmet>
        <title>Token Sale | Emmet.Finance</title>
        <meta property="og:title" content="Token Sale | Emmet.Finance" />
        <meta property="og:description" content="Emmet Finance Token Sale – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation." />
        <meta name="description" content="Emmet Finance Token Sale – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation."/>
      </Helmet>
      <div className="webWraper tokenomics">
      <HeaderNotify />
        <WebHeader />
        <div className="tokenomicsWrap">
          <IntroducingEMMET />
          <span className="borderLine">
            <img src={BorderLine} alt="BorderLine" />
          </span>
          <Distribution />
          <TokenomicsBox />
        </div>
        <WebFooter />
      </div>
    </>
  );
}
