

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { keccak256, toUtf8Bytes } from "ethers";
import useTokenSale from "../../../hooks/useTokenSale";
import CopyAddress from "../../../assets/img/web/Tokenomics/Copy.svg";

export default function RefComponent() {

    const Captions = {
        COPY: "COPY",
        SAVE: "SAVE"
    }

    const { address } = useAccount();
    const { saveRef, isRefRegistered, registered } = useTokenSale();

    const generateRefCode = () => {
        if (address) {
            const hash = keccak256(toUtf8Bytes(address.toLowerCase())); // Normalize and hash
            return hash.slice(2, 10); // Take first 8 hex characters
        }
        return "";

    };

    const [ref, setRef] = useState(generateRefCode());
    const [caption, setCaption] = useState(Captions.SAVE);

    const saveReference = () => {
        if (ref && caption === Captions.SAVE) {
            saveRef(ref);
        } else if (ref && caption === Captions.COPY) {
            (async () => {
                await navigator.clipboard.writeText(`${window.location.href.split("?")[0]}?ref=${ref}`);
            })();
        }
    }

    useEffect(() => {
        if (!ref && address) {
            setRef(generateRefCode());
        }
    }, [address]);

    useEffect(() => {

        if (!registered) { isRefRegistered(ref); }

        if (ref && registered) {
            setCaption(Captions.COPY);
        } else {
            setCaption(Captions.SAVE);
        }

    }, [ref, registered, address]);

    return (<div>
        <div className="emmetBuyColum">
            <div className="emmetSpentBox">
                {/* <p className="label">Reference</p> */}
                <div className="emmetSpentinput">
                    <input
                        type="text"
                        value={ref && `${window.location.href.split("?")[0]}?ref=${ref}`}
                        style={{ "width": "100%", "fontSize": "1rem" }}
                        placeholder="Conect the wallet to generate a reference"
                        readOnly={true}
                    />
                </div>
            </div>
            {ref && <div className="emmetBalance showCursor" onClick={saveReference}>
                {/* <p className="label right-text">.</p> */}
                <div className="receiveEmmet">
                    {!registered
                        ? (<img src="/img/save.svg" alt="save" />)
                        : (<img src={CopyAddress} alt="Copy" />)}
                    <span>{caption}</span>
                </div>
            </div>}
        </div>
        <p></p>
        <p>Earn <span style={{ "color": "#efeb00" }}>7%</span> on top of every deposit of your referrals. <br />
            Get additional <span style={{ "color": "#efeb00" }}>3%</span> of your invite’s deposits. <br />
            The more your friends deposit, the more you earn! <br />
            {address && (<>
                {!registered
                    ? (<><span style={{ "color": "#efeb00" }}> Click SAVE</span> to register your reference on-chain (smart contract).</>)
                    : (<><span style={{ "color": "#efeb00" }}> Share</span> the reference with your friends.</>)
                }
            </>)}
        </p>
    </div>)

}