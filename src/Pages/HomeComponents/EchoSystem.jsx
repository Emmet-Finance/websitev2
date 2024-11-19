import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import "./EchoSystem.css";

import chain1 from "../../assets/img/ecosystem/chains/ton.svg"
import chain2 from "../../assets/img/ecosystem/chains/Ethereum.svg"
import chain3 from "../../assets/img/ecosystem/chains/Polygon.svg"
import chain4 from "../../assets/img/ecosystem/chains/Arbitrum.svg"
import chain5 from "../../assets/img/ecosystem/chains/BSC.svg"
import chain6 from "../../assets/img/ecosystem/chains/Optimism.svg"
import chain7 from "../../assets/img/ecosystem/chains/Skale.svg"
import chain8 from "../../assets/img/ecosystem/chains/OnlyLayer.svg"
import chain9 from "../../assets/img/ecosystem/chains/Avalanche.svg"
import chain10 from "../../assets/img/ecosystem/chains/Base.svg"

import chain11 from "../../assets/img/ecosystem/dex/Stone.Fi.svg"
import chain12 from "../../assets/img/ecosystem/dex/Uniswap.svg"

import chain13 from "../../assets/img/ecosystem/dapps/cavi.svg"
import chain14 from "../../assets/img/ecosystem/dapps/moon.svg"
import chain15 from "../../assets/img/ecosystem/dapps/halo.svg"
import chain16 from "../../assets/img/ecosystem/dapps/torch.svg"

import chain17 from "../../assets/img/ecosystem/saas/pyth.svg"
import chain18 from "../../assets/img/ecosystem/saas/certik.svg"
import chain19 from "../../assets/img/ecosystem/saas/Coinvent.svg"

function EchoSystem() {
    return ( 
        <div className="echosystemContainner">
            <div className="container">
                <h2 className='text-center'>Emmet growing ecosystem</h2>

                <div className="echoTab">
                    <Tabs defaultActiveKey="chains" id="echo-tab" className="">
                        <Tab eventKey="chains" title="Chains">
                            <div className="imageGrid">
                                <div className="echoImage">
                                    <img src={chain1} alt="Echo" />
                                    <p>Ton</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain2} alt="Echo" />
                                    <p>Ethereum</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain3} alt="Echo" />
                                    <p>Polygon</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain4} alt="Echo" />
                                    <p>Arbitrum</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain5} alt="Echo" />
                                    <p>BSC</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain6} alt="Echo" />
                                    <p>Optimism</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain7} alt="Echo" />
                                    <p>Skale</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain8} alt="Echo" />
                                    <p>OnlyLayer</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain9} alt="Echo" />
                                    <p>Avalanche</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain10} alt="Echo" />
                                    <p>Base</p>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="DEX" title="DEX">
                            <div className="imageGrid">
                                <div className="echoImage">
                                    <img src={chain11} alt="Echo" />
                                    <p>Stone.Fi</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain12} alt="Echo" />
                                    <p>Uniswap</p>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="Dapps" title="Dapps">
                            <div className="imageGrid">
                                <div className="echoImage">
                                    <img src={chain13} alt="Echo" />
                                    <p>CAVI</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain14} alt="Echo" />
                                    <p>NFT Moon Metaverse</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain15} alt="Echo" />
                                    <p>Halo Pixel</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain16} alt="Echo" />
                                    <p>Torch Finance</p>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="SaaS" title="SaaS">
                            <div className="imageGrid">
                                <div className="echoImage">
                                    <img src={chain17} alt="Echo" />
                                    <p>Pyth Network</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain18} alt="Echo" />
                                    <p>Certik</p>
                                </div>
                                <div className="echoImage">
                                    <img src={chain19} alt="Echo" />
                                    <p>Coinvent</p>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>

            </div>
        </div>
     );
}

export default EchoSystem;