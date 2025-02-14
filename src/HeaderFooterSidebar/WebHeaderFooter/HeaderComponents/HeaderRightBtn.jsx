import React from "react";
import "./HeaderRightBtn.css";

function HeaderRightBtn() {
  return (
    <ul className="headerRIghtBtn">
      <li>
        <a
          href="https://doc.emmet.finance/docs/roadmap"
          target="_blank"
          rel="noreferrer noopener"
        >Roadmap</a>
      </li>
      <li>
        <a 
          href="https://github.com/Emmet-Finance/whitepaper/blob/main/Emmet_Finance_Whitepaper.pdf"
          target="_blank"
          rel="noreferrer noopener"
        >Whitepaper</a>
      </li>
      <li>
        <a 
          href="https://doc.emmet.finance"
          target="_blank"
          rel="noreferrer noopener"
        >Docs</a>
      </li>
    </ul>
  );
}

export default HeaderRightBtn;
