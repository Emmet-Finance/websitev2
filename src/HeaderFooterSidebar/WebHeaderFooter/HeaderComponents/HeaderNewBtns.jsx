import React from "react";
import AirdropEmmet from "../../../assets/img/web/AirdropEmmet.svg";
import EmmetTokken from "../../../assets/img/web/EmmetTokken.svg";

import "./HeaderNewBtns.css";

function HeaderNewBtns() {
  return (
    <div className="headerBtn">
      <a
        href="https://docs.emmet.finance/ecosystem-and-partnerships/emmetcolony-airdrop-adventure"
        target="_blank"
        className="AirdropEmmet"
      >
        🔥 <span>Airdrop</span> $EMMET Inscription
        <img src={AirdropEmmet} alt="AirdropEmmet" />
      </a>
      {/* <a href="https://staging.emmet.finance/tokensale" target='_blank' className='EmmetTokken'>
                $EMMET Token Pre-sale
                <img src={EmmetTokken} alt="EmmetTokken" />
            </a> */}
    </div>
  );
}

export default HeaderNewBtns;
