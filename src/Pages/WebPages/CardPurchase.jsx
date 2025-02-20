import React from "react";
import WebHeader from "../../HeaderFooterSidebar/WebHeaderFooter/WebHeader";
import WebFooter from "../../HeaderFooterSidebar/WebHeaderFooter/WebFooter";
import TitleBg from "../../assets/img/web/title-bg.png";
import "./WebHome.css";
import "./PrivacyPolicy.css";

export default function CardPurchase() {
    return (
        <>
            <div className="webWraper">
                <WebHeader />
                <div className="pageWraper privacyPolicyarea">
                    <div className="privacyPolicy">
                        <div className="container">
                            <div className="privacyPolicyTitle">
                                <img src={TitleBg} className="TitleBg" alt="TitleBg" />
                                <h1>
                                    <img src="/img/creditcard.svg" style={{
                                        width: "60px", 
                                        paddingRight: "20px",
                                        paddingBottom: "8px"
                                    }}/>
                                    Purchase USDT with a card
                                </h1>
                            </div>
                            <div className="privacyPolicyContent">
                                <h3>New to DeFi?</h3>
                                <br />
                                Getting started is simple! You can buy EMMET tokens with your credit or debit card—no verification or KYC required.
                                <br /><br />
                                <h4>Step 1: Buy USDT on BNB Chain Using Your Card</h4>
                                <br />
                                Head to one of these trusted platforms to purchase Tether (USDT) on BNB Chain:<br />
                                ✅ Ramp Network - (<a href="https://ramp.network/buy">https://ramp.network/buy</a>)<br />
                                ✅ Transak - (<a href="https://global.transak.com" >https://global.transak.com</a>)<br />
                                <br />
                                Follow the platform’s instructions to buy USDT (BEP-20) and send it directly to your wallet.
                                <br /><br />
                                💡 Tip: To cover all costs, including gas fees for buying EMMET, we recommend purchasing at least $50 worth of USDT.
                                <br /><br />
                                <h4>Step 2: Swap USDT for EMMET</h4>
                                <br />
                                Once USDT is in your wallet, use it to purchase EMMET:
                                <br />
                                🔹 Connect your wallet to the Emmet Finance website.<br />
                                🔹 Follow the steps outlined in the "How to Buy Emmet (EMMET)" guide.<br />
                                <br />
                                ⚠️ Note: Make sure your wallet has enough BNB to cover gas fees for the transaction.
                                <br />

                            </div>
                        </div>
                    </div>
                </div>
                <WebFooter />
            </div>
        </>
    );
}
