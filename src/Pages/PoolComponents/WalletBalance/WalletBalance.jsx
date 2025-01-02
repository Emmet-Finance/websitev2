import React from "react";
import Wallet from "../../../assets/img/Wallet.svg";
import "./WalletBalance.css";
import { useAppSelector } from "../../../hooks/storage";
import usePool from "../../../hooks/usePool";
import ButtonSpinner from "../../CommonComponents/Spinner/ButtonSpinner";

export default function WalletBalance({ name, activeButton }) {

  const pool = useAppSelector((state) => state.pool);

  const { isLoadingBalance } = usePool();

  return (
    <div className="walletBalance">
      <img src={Wallet} alt="Wallet" />
      <span>
        {activeButton === "Deposit"
          ? (isLoadingBalance
            ? <ButtonSpinner />
            : pool.balance)
          : (isLoadingBalance
            ? <ButtonSpinner />
            : pool.stakedBalance)
        }
      </span>
      <span>{name}</span>
    </div>
  );
}
