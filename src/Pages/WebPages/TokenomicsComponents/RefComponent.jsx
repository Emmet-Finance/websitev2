

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { keccak256, toUtf8Bytes } from "ethers";
import useTokenSale from "../../../hooks/useTokenSale";
import CopyAddress from "../../../assets/img/web/Tokenomics/Copy.svg";

export default function RefComponent() {

    const { address } = useAccount();

    const generateRefCode = () => {
        if (address) {
            const hash = keccak256(toUtf8Bytes(address.toLowerCase())); // Normalize and hash
            return hash.slice(2, 10); // Take first 8 hex characters
        }
        return "";

    };

    const [ref, setRef] = useState(generateRefCode());

    const { saveRef } = useTokenSale();

    const saveReference = () => {
        if (ref) {
            saveRef(ref);
        }
    }

    useEffect(() => {
        if (!ref && address) {
            setRef(generateRefCode());
        }
    }, [address]);

    const handleCopyClick = () => {
        (async () => {
            await navigator.clipboard.writeText(`${window.location.href.split("?")[0]}?ref=${ref}`);
        })();
    }

    return (<div>
        <div className="emmetBuyColum">
            <div className="emmetSpentBox">
                {/* <p className="label">Reference</p> */}
                <div className="emmetSpentinput">
                    <input
                        type="text"
                        value={ref && `${window.location.href.split("?")[0]}?ref=${ref}`}
                        style={{ "width": "100%", "fontSize": "1rem" }}
                        placeholder="Conect your wallet to generate a reference link"
                        readOnly={true}
                    />
                    <button className="copyLink" onClick={() => handleCopyClick()}>
                        <span className="copyAddressLink">
                            <img src={CopyAddress} alt="Copy" />
                        </span>
                    </button>
                </div>
            </div>
            <div className="emmetBalance showCursor" onClick={saveReference}>
                {/* <p className="label right-text">.</p> */}
                <div className="receiveEmmet">
                    <img src="/img/save.svg" alt="save" /><span>SAVE</span>
                </div>
            </div>
        </div>
        <p></p>
        <p>Earn <span style={{ "color": "#efeb00" }}>7%</span> on top of every deposit of your referrals.
            Get an additional <span style={{ "color": "#efeb00" }}>3%</span> of your invite’s invites deposits.
            The more your invites deposit, the more you earn!
            <span style={{ "color": "#efeb00" }}> Click SAVE</span> to register your reference on-chain (smart contract).
        </p>
    </div>)

}