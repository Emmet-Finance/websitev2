import React, { useState, useEffect } from "react";
import "./YourPool/YourPool.css";
import YourPool from "./YourPool/YourPool";
import PoolTableArea from "./PoolTable/PoolTableArea";
import ExplorerHeaderSearch from "../../HeaderFooterSidebar/ExplorerHeaderSearch";

export default function PoolPageContainer() {
  const [showHeaderSearch, setShowHeaderSearch] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowHeaderSearch(window.innerWidth <= 1024);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="poolpageContainer">
      {/* {showHeaderSearch && <ExplorerHeaderSearch />} */}
      <YourPool />
      <PoolTableArea />
    </div>
  );
}
