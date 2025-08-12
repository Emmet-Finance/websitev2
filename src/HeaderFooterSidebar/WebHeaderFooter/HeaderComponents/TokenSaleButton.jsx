import React from "react";
import EmmetToken from "../../../assets/img/web/EmmetTokken.svg";

function TokenSaleButton() {
    const isTokensalePage = window.location.href.includes("/tokensale");
    const isMobile = window.innerWidth <= 768; // Adjust the width as needed for mobile detection
    return (
        <>
            {
                !isTokensalePage
                    ? (<a href="/tokensale"
                        // target='_blank'
                        className='EmmetTokken'
                        rel="noreferrer noopener"
                    >
                        $EMMET {!isMobile && "Pre-"}sale
                        <img src={EmmetToken} alt="EmmetToken" />
                    </a>)
                    : (<></>)
            }
        </>
    );
}

export default TokenSaleButton;