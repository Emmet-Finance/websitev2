import React from 'react';
import { useAppSelector } from '../../../hooks/storage';
import { getDomainToChainName, getChainSymbolFromName, restoreOriginalSumSent, removeTrailingZeroes } from '../../../utils';
import useGetTxValue from '../../../hooks/useGetTxValue'

function TransactionDetailsRight({ fromFee, toFee }) {

    const explorer = useAppSelector(store => store.explorer);

    const bridgeFee = useGetTxValue(
        explorer.bridgeTransaction.burnHash,
        getDomainToChainName(explorer.bridgeTransaction.originalDomain)
    )

    function decimals() {
        switch (explorer.bridgeTransaction.symbol) {
            case 'EURC':
            case 'USDC':
                return 1e6;
            default:
                return 1e18;
        }
    }

    return (
        <div className="transactionDetailsBox">
            <ul className="transactionDetailsList">
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Sent amount
                    </div>
                    <div className="transactionDetailsListRight">
                        {/* If amount < 2,000 then fixed fee $0.4, else 0.02% of the amount */}
                        {removeTrailingZeroes(restoreOriginalSumSent(explorer.bridgeTransaction.amount / decimals()))} {explorer.bridgeTransaction.symbol}
                    </div>
                </li>
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Received amount
                    </div>
                    <div className="transactionDetailsListRight">
                        {explorer.bridgeTransaction.amount / decimals()} {explorer.bridgeTransaction.symbol}
                    </div>
                </li>
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Protocol Fee
                    </div>
                    <div className="transactionDetailsListRight">
                        <div className="bridgeFee">
                            {/* {bridgeFee && `${bridgeFee / 1e18}`.slice(0, 10)}{' '}
                            {getChainSymbolFromName(getDomainToChainName(
                                explorer.bridgeTransaction.originalDomain
                            ))} */}
                            {removeTrailingZeroes(
                                Number(restoreOriginalSumSent(explorer.bridgeTransaction.amount / decimals()) 
                                - explorer.bridgeTransaction.amount / decimals()).toFixed(6)
                            )} {explorer.bridgeTransaction.symbol}
                        </div>
                    </div>
                </li>
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Origin Fee
                    </div>
                    <div className="transactionDetailsListRight">
                        {fromFee && fromFee}{' '}
                        {getChainSymbolFromName(getDomainToChainName(
                            explorer.bridgeTransaction.originalDomain
                        ))}
                    </div>
                </li>
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Destination Fee
                    </div>
                    <div className="transactionDetailsListRight">
                        {toFee && toFee}{' '}
                        {getChainSymbolFromName(getDomainToChainName(
                            explorer.bridgeTransaction.destinationDomain
                        ))}
                    </div>
                </li>
                <li className='transactionDetailsListItem'>
                    <div className="transactionDetailsListLeft">
                        Value Received
                    </div>
                    <div className="transactionDetailsListRight">
                        $ {explorer.bridgeTransaction.amount / decimals()}
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default TransactionDetailsRight;