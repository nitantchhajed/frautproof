import React, { useState } from "react";
import "../../../assets/style/pages/landing/txTable.scss";
import { Table, Container, Button } from "react-bootstrap"
import Web3 from "web3";
import { challengeABI } from "../../../challengeContract";
import { useAccount } from "wagmi";
import { AiOutlineCheck } from "react-icons/ai"
import { Link } from "react-router-dom";
const TxTable = ({ sentTxn }) => {
    const { address } = useAccount();
    const web3 = new Web3(window.ethereum)
    const [claimStatus, setClaimStatus] = useState(false)
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const CONTRACT_INSTANCE = new web3.eth.Contract(challengeABI, contractAddress)

    //======================================================== REVERT TRANSACTION =============================================

    const challengeTxn = async (id) => {
        try {
            const challenge = await CONTRACT_INSTANCE.methods.revertTransaction(id).send({ from: address });
            console.log("challenge", challenge);
            setClaimStatus(true)
        } catch (error) {
            console.log(error);
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <section className="txTable_wrap">
                <Container fluid>
                    <div className="txTable-title">
                        <h6 className="text-light">SENT TRANSACTIONS</h6>
                    </div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Recipient</th>
                                <th>Challenge End Time</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sentTxn.map((event, key) => {
                                    const { recipient, challengeEndTime, id, amount, isCompleted } = event
                                    const timeToString = challengeEndTime.toString()
                                    const timeToNumber = Number(timeToString) * 1000
                                    const convertTime = new Date(timeToNumber).toLocaleString('en-US')
                                    return (
                                        <tr key={key}>
                                            <td><Link to={`https://testnet.racescan.io/address/${recipient}`} target="_blank" className="wallet_address">{recipient}</Link></td>
                                            <td>{convertTime}</td>
                                            <td>{Web3.utils.fromWei(amount, "ether").toString()} ETH</td>
                                            <td>{isCompleted ? "Challenged" : "Not Challenged"}</td>
                                            <td>{!isCompleted ? <div className="challenge_btn_wrap"><Button type="button" className="btn challenge_btn" onClick={() => challengeTxn(id)}>Challenge</Button></div> : <span className='checkIcn'><AiOutlineCheck /></span>}</td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </Table>
                </Container>
            </section>
        </>
    )
}
export default TxTable