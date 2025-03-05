import ReactGA from "react-ga";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/storage";
// Icons
import DownArrow from "../../assets/img/down-white.svg";
import {setToken, STAKING_ICONS} from "../../store/stakingSlice";

export default function TokenSelector() {
    const selectCoinRef = useRef(null);
    const staking = useAppSelector((state) => state.staking);
    const dispatch = useAppDispatch();
    const isMultipleTokens = staking.tokens.length > 1;

    const [isListVisible, setListVisible] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState({
        icon: STAKING_ICONS[staking.tokens[0]],
        name: staking.tokens[0]
    })

    const toggleVisibility = () => {
        setListVisible(!isListVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectCoinRef.current &&
                !selectCoinRef.current.contains(event.target)
            ) {
                setListVisible(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleCoinClick = (name) => {
        setSelectedCoin({ icon: STAKING_ICONS[name], name });
        toggleVisibility();
        dispatch(setToken(name));
        ReactGA.event({
            category: "User",
            action: "Clicked Button",
            label: "Token Select",
        });
    };


    return (
        <div className="selectCoin" ref={selectCoinRef}>
            <div className="selectedCoin" onClick={toggleVisibility}>
                <div className="coinNameIcon">
                    <img src={selectedCoin.icon} alt={selectedCoin.name} />
                    <span>{selectedCoin.name}</span>
                </div>
                {isMultipleTokens && <img src={DownArrow} alt="Down Arrow" />}
            </div>
            {isMultipleTokens && (
                <ul
                    className={`selectCoinList ${isListVisible ? "visible" : "hidden"}`}
                >
                    {staking.tokens.map((coin) => (
                        <li className="coinItem" key={coin}>
                            <div
                                className="coinNameIcon"
                                onClick={() => handleCoinClick(coin)}
                            >
                                <img src={STAKING_ICONS[coin]} alt={coin} />
                                <span>{coin}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    )
}