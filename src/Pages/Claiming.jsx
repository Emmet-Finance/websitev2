import useMobileDetector from "../hooks/useMobileDetector";
import React from "react";
import MobileHeader from "../HeaderFooterSidebar/MobileHeader";
import Sidebar from "../HeaderFooterSidebar/Sidebar";
import ClaimEmmet from "./ClaimingComponents/ClaimEmmet";
import ClaimFAQ from "./ClaimingComponents/ClaimFAQ";
import ClaimingHeader from "../HeaderFooterSidebar/WebHeaderFooter/ClaimingHeader";
import { Helmet } from "react-helmet-async";
import useClaming from "../hooks/useClaming";

const Claiming = () => {
    const isMobile = useMobileDetector();
    useClaming();

    return (<>
        <Helmet>
            <title>Token Staking | Emmet.Finance</title>
            <meta property="og:title" content="Token Claiming | Emmet.Finance" />
            <meta property="og:description" content="Emmet Finance Token Claiming – Claim the EMMET token" />
            <meta name="description" content="Emmet Finance Token Claiming – Claim the EMMET token" />
            <meta name="robots" content="index, follow" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="/img/banners/tokenomics.png" />
        </Helmet>
        {isMobile
            ? (<div className="MobilePageContainer poolPageWrap">
                <div className="mobileArea" id="mobileContainer">
                    <MobileHeader />
                    <div className="stakingPageContent">
                        <div className="container">
                            <div className="row">

                                <div className="col-lg-6">
                                    <ClaimEmmet />
                                    <ClaimFAQ />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
            : (<div className="stakingWrap">
                <div className="pageContainer deskPoolPageWrap addLiquidityPage">
                    <div className="pageContentRow" id="desktopContainer">
                        <div className="sidebarArea">
                            <Sidebar />
                        </div>
                        <div className="mainWrap">
                            <div className="stakingHeader">
                                <ClaimingHeader />
                            </div>
                            <div className="stakingPageContent">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <ClaimEmmet />
                                            <ClaimFAQ />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        }
    </>)
};

export default Claiming;