import React from "react";
import Wallet from "../../assets/img/Wallet.svg";
import "../HomeComponents/WalletBalance/WalletBalance.css";
import { TOKEN_SYMBOL_TO_TOKEN } from "../../types";
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner"

export default function WalletBalance({ name, parent, balance, showSpinner=false }) {
  return (
    <div className="walletBalance">
      <img src={Wallet} alt="Wallet" />
      {
        showSpinner
        ? <ButtonSpinner />
        : <span>{parent === "lock-and-mint" ? Number(balance).toLocaleString() : "0.00"}</span>
      }
      
      <span>{TOKEN_SYMBOL_TO_TOKEN[name]}</span>
    </div>
  );
}
