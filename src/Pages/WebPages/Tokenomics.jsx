import React, { useEffect } from "react";
import WebHeader from "../../HeaderFooterSidebar/WebHeaderFooter/WebHeader";
import WebFooter from "../../HeaderFooterSidebar/WebHeaderFooter/WebFooter";
import IntroducingEMMET from "./TokenomicsComponents/IntroducingEMMET";
import TokenomicsBox from "./TokenomicsComponents/TokenomicsBox";
import Distribution from "./TokenomicsComponents/Distribution";
import BorderLine from "../../assets/img/web/Tokenomics/line.png";

import "./Tokenomics.css";

function Tokenomics() {

  const isTokensale = window.location.href.includes("/tokensale");

  useEffect(() => {
    document.title = "Emmet.Finance | Token Sale";

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute(
      "content",
      "Emmet Finance Token Sale – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation."
    );

    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement("meta");
      keywordsMeta.setAttribute("name", "keywords");
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute(
      "content",
      "Buy Emmet Token"
    );

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", "Emmet.Finance | Token Sale");

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute(
      "content", 
      "Emmet Finance Token Sale – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation."
    );

    let ogRobots = document.querySelector('meta[property="robots"]');
    if (!ogRobots) {
      ogRobots = document.createElement("meta");
      ogRobots.setAttribute("property", "robots");
      document.head.appendChild(ogRobots);
    }
    ogRobots.setAttribute("content", "index, follow");

  }, [isTokensale]);

  return (
    <>
      <div className="webWraper tokenomics">
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

export default Tokenomics;
