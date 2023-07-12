import React, { useEffect } from "react";
import "../../../assets/style/pages/landing/txTable.scss";
import { Table, Container, Button } from "react-bootstrap"
import Web3 from "web3";
import { challengeABI } from "../../../challengeContract";
import { useAccount } from "wagmi"
const TxTable = ({ sentTxn }) => {  
    const { address } = useAccount();
    const web3 = new Web3(window.ethereum)
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const CONTRACT_INSTANCE = new web3.eth.Contract(challengeABI, contractAddress)
    const challengeTxn = async (id) => {
        const challenge =  await CONTRACT_INSTANCE.methods.revertTransactions(id);
        console.log("challenge", challenge);
    }
    return (
        <>
            <section className="txTable_wrap">
                <Container fluid>
                    <div className="txTable-title">
                        <h6 className="text-light">RECENT TRANSACTION</h6>
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
                                            <td>{recipient}</td>
                                            <td>{convertTime}</td>
                                            <td>{Web3.utils.fromWei(amount, "ether").toString()} ETH</td>
                                            <td>{isCompleted ? "true" : "false"}</td>
                                            <td><div className="challenge_btn_wrap"><Button type="button" className="btn challenge_btn" onClick={()=>challengeTxn(id)}>Challenge</Button></div></td>
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