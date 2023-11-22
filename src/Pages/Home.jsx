import React from 'react';
import Header from '../HeaderFooterSidebar/Header';
import Footer from '../HeaderFooterSidebar/Footer';
import Sidebar from '../HeaderFooterSidebar/Sidebar';
import SwapContainer from './HomeComponents/SwapContainer';


function HomePage() {
    return ( 
        <div className="pageContainer">
            <div className="pageContentRow">
                <div className="sidebarArea">
                    <Sidebar/>
                </div>
                <div className="mainWrap">
                    <Header/>
                    <div className="pageContent">
                        <div className="swapContainerArea">
                            <SwapContainer/>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
     );
}

export default HomePage;