import React from "react";
import Header from "../HeaderFooterSidebar/Header";
import Footer from "../HeaderFooterSidebar/Footer";
import Sidebar from "../HeaderFooterSidebar/Sidebar";
import MobileHeader from "../HeaderFooterSidebar/MobileHeader";
// import SidebarSlider from '../HeaderFooterSidebar/SidebarComponent/SidebarSlider';
import PoolPageContainer from "./PoolComponents/PoolPageContainer";
import useMobileDetector from "../hooks/useMobileDetector";
import useFetchPositions from "../hooks/useFetchPositions";
import useFetchPools from "../hooks/useFetchPools";

const PoolPage = () => {
  const isMobile = useMobileDetector();

  useFetchPositions();
  useFetchPools();

  return (
    <>
      {isMobile ? (
        <div className="MobilePageContainer poolPageWrap">
          <div className="mobileArea" id="mobileContainer">
            <MobileHeader />
            <PoolPageContainer />
            {/* <SidebarSlider/> */}
            <Footer />
          </div>
        </div>
      ) : (
        <div className="pageContainer deskPoolPageWrap">
          <div className="pageContentRow" id="desktopContainer">
            <div className="sidebarArea">
              <Sidebar />
            </div>
            <div className="mainWrap">
              <Header caption="Pool" />
              <div className="pageContent">
                <div className="swapContainerArea">
                  <PoolPageContainer />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoolPage;
