import React from "react";
import "./NavSocial.css";

function NavSocial() {
  return (
    <div className="social_box">
      <ul className="socialList">
        <li>
          <a
            aria-label="Go to the corporate X (former Twitter) channel"
            href="https://twitter.com/Emmet_Finance"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={"/img/social/x.svg"} alt="X (former Twitter) Logo" />
          </a>
        </li>
        <li>
          <a
            aria-label="Go to the corporate GitHub repository"
            href="https://github.com/Emmet-Finance/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={"/img/social/github.svg"} alt="GitHub Logo" />
          </a>
        </li>
        <li>
          <a
            aria-label="Go to the corporate Discord channel"
            href="https://discord.com/invite/yuXxDctC4W"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={"/img/social/Discord.svg"} alt="Discord Logo" />
          </a>
        </li>
        <li>
          <a
            aria-label="Go to the corporate Telegram channel"
            href="https://t.me/Emmet_Finance"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={"/img/social/Telegram.svg"} alt="Telegram Logo" />
          </a>
        </li>
        <li>
          <a
            aria-label="Go to the corporate Telegram channel"
            href="https://t.me/Emmet_Finance_Announcements"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={"/img/social/Telegram.svg"} alt="Telegram Logo" />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default NavSocial;
