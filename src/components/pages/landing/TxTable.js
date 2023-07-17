import React, { useEffect, useState } from "react";
import "../../../assets/style/pages/landing/txTable.scss";
import { Table, Container, Button } from "react-bootstrap"
import Web3 from "web3";
import { challengeABI } from "../../../challengeContract";
import { useAccount } from "wagmi";
import { AiOutlineCheck } from "react-icons/ai"
import { Link } from "react-router-dom";
import Loader from "../../common/Loader";
const TxTable = ({ sentTxn, setNewState }) => {
    const { address } = useAccount();
    const web3 = new Web3(window.ethereum)
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const CONTRACT_INSTANCE = new web3.eth.Contract(challengeABI, contractAddress)
    const [transaction, setTransaction] = useState([])
    const [updateValue, setUpdateValue] = useState(false)
    const [loader, setLoader] = useState(false)
    //======================================================== REVERT TRANSACTION =============================================

    const challengeTxn = async (id) => {
        try {
            setLoader(true)
            const challenge = await CONTRACT_INSTANCE.methods.revertTransaction(id).send({ from: address });
            setUpdateValue(true)
            setNewState(true)
            setLoader(false)
            console.log("challenge", challenge);
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("inner data");
        const currentDateTime = new Date().toLocaleString('en-US');
        const newArray = sentTxn.map(v => ({ ...v, isExpired: false }))
        newArray.forEach(function (a) {
            if (a.isCompleted == false && a.isReverted == false) {
                const timeToString = a.challengeEndTime.toString()
                const timeToNumber = Number(timeToString) * 1000;
                const convertTime = new Date(timeToNumber).toLocaleString('en-US')
                if (currentDateTime > convertTime) {
                    a.isExpired = true;
                };
            }
        })
        setTransaction(newArray.reverse())
    }, [sentTxn, updateValue])

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

                                transaction.map((event, key) => {
                                    const { recipient, challengeEndTime, isExpired, id, amount, isCompleted } = event
                                    const timeToString = challengeEndTime.toString()
                                    const timeToNumber = Number(timeToString) * 1000;
                                    const convertTime = new Date(timeToNumber).toLocaleString('en-US')
                                    return (
                                        <tr key={key}>
                                            <td><Link to={`https://testnet.racescan.io/address/${recipient}`} target="_blank" className="wallet_address">{recipient}</Link></td>
                                            <td>{convertTime}</td>
                                            <td>{Web3.utils.fromWei(amount, "ether").toString()} ETH</td>
                                            <td>{isCompleted ? "Challenged" : "Not Challenged"}</td>
                                            <td>{isCompleted ? <span className='checkIcn'><AiOutlineCheck /></span> : isExpired ? "Expired" : loader ? <div className="challenge_btn_wrap"> <Button type="button" className="btn challenge_btn" disabled><Loader /></Button></div>:  <div className="challenge_btn_wrap"><Button type="button" className="btn challenge_btn" onClick={() => challengeTxn(id)}>Challenge</Button></div>}</td>
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
