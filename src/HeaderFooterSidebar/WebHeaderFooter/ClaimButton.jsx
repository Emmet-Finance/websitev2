import React, { useEffect, useState } from "react";
import useTokenSale from "../../hooks/useTokenSale";
import AlertModal from "./AlertModal";

export default function ClaimButton() {

    const [msg, setMsg] = useState("");
    const [alertIsOpen, setAlertIsOpen] = useState(false);

    const { error, setError, claimEmmet } = useTokenSale();

    const isTokensale = window.location.href.includes("/tokensale");

    const handleClaimClick = () => {
        claimEmmet()
    }

    useEffect(() => {

        if (error) {
            setMsg(error);
            setAlertIsOpen(true);
        } else {
            setMsg("");
            setAlertIsOpen(false);
        }

    }, [error]);

    function closedAlert() {
        setMsg("");
        setAlertIsOpen(false);
        setError("")
    };

    return (isTokensale ? (
        <>
            <AlertModal
                msg={msg}
                alertIsOpen={alertIsOpen}
                closedAlert={() => closedAlert()}
            />
            <div
                className="launchApp pointer"
                onClick={handleClaimClick}
            >
                Claim
            </div>
        </>
    ) : (
        <></>
    )
    );

}