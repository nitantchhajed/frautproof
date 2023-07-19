import React, { useEffect, useState } from 'react'
import { useAccount } from "wagmi";
import { challengeABI } from '../../../challengeContract';
import Web3 from "web3";
import { AiOutlineCheck } from "react-icons/ai";
import "../../../assets/style/pages/claim/claim.scss";
import { Container, Button, Table } from "react-bootstrap";
import Loader from '../../common/Loader';
const Index = () => {

  //============================================================== HOOKS ===============================================================
  const [claimStatus, setClaimStatus] = useState(false)
  const web3 = new Web3(window.ethereum)
  const [receiverTxn, setReceiverTxn] = useState([])
  const { address } = useAccount();
  const [transaction, setTransaction] = useState([])
  const [updateValue, setUpdateValue] = useState(false)
  const [loader, setLoader] = useState(NaN)
  useEffect(() => {
    received()
  }, [claimStatus, address])
  //------------------------------------------------------------------------------------------------------------------------------------

  //=========================================================== CONTRACT ===============================================================

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
  const contractABI = challengeABI
  const CONTRACT_INSTANCE = new web3.eth.Contract(contractABI, contractAddress)

  //------------------------------------------------------------------------------------------------------------------------------------

  //=========================================================== RECEIVER TRANSACTION DATA =============================================================

  const received = async () => {
    const receiverData = await CONTRACT_INSTANCE.methods.viewTransactionsByRecipient().call({from: address})
    let receivedTxnData = []
    for (let index = 0; index < receiverData.length; index++) {
      const element = receiverData[index];
      const TxnData = await CONTRACT_INSTANCE.methods.allTransactions(element).call({ from: address })
      receivedTxnData.push(TxnData)
    }
    setReceiverTxn(receivedTxnData)
    console.log("receivedTxnData", receivedTxnData);
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------

  //=========================================================== CLAIM TRANSACTION =============================================================

  async function claim(e, id) {
    try {
      const dataValue = e.target.getAttribute('data-value')
      console.log("dataValue", dataValue);
      setLoader(dataValue)
      const claimTxn = await CONTRACT_INSTANCE.methods.claimFunds(id).send({ from: address })
      console.log({ claimTxn });
      setUpdateValue(true)
      setClaimStatus(true)
      setLoader(NaN)
    } catch (error) {
      setLoader(NaN)
      console.log(error);
    }
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------


  useEffect(() => {
    console.log("inner data");
    const currentDateTime = new Date().toLocaleString('en-US');
    const newArray = receiverTxn.map(v => ({ ...v, isClaimable: false, inChallenge: false }))
    newArray.forEach(function (a) {
      if (a.isCompleted == false && a.isReverted == false) {
        const timeToString = a.challengeEndTime.toString()
        const timeToNumber = Number(timeToString) * 1000;
        const convertTime = new Date(timeToNumber).toLocaleString('en-US')
        if (currentDateTime > convertTime) {
          a.isClaimable = true;
        } else {
          a.inChallenge = true;
        }

      }
    })
    setTransaction(newArray.reverse())
  }, [receiverTxn, updateValue])

  //--------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      <section className="claimTable_wrap">
        <Container fluid>
          <div className="claimTable-title">
            <h6 className="text-light">RECEIVED TRANSACTIONS</h6>
          </div>
          <Table responsive>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Challenge End Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transaction.length > 0 ?
                transaction.map((event, key) => {
                  const { sender, challengeEndTime, id, amount, isReverted, isCompleted, isClaimable, inChallenge } = event
                  const timeToString = challengeEndTime.toString()
                  const timeToNumber = Number(timeToString) * 1000
                  const convertTime = new Date(timeToNumber).toLocaleString('en-US')
                  return (
                    <tr key={key}>
                      <td>{sender}</td>
                      <td>{convertTime}</td>
                      <td>{Web3.utils.fromWei(amount, "ether").toString()} ETH</td>
                      <td>{isReverted ? "Challenged" : "Not Challenged"}</td>
                      <td>
                        {
                          isClaimable ? loader == key ?
                            <div className="challenge_btn_wrap">
                              <Button type="button" className="btn challenge_btn" disabled><Loader /></Button>
                            </div>
                            :
                            <div className="challenge_btn_wrap">
                              <Button type="button" className="btn challenge_btn" data-value={key} onClick={(e) => claim(e, id)}>Claim</Button>
                            </div>
                            :
                            inChallenge ? "In challenge period" : <span className='checkIcn'><AiOutlineCheck /></span>
                        }
                      </td>
                    </tr>
                  )
                })
                : <tr>
                  <td colSpan={5}>
                    <div className="text-center text-light"><h3>No Transaction Available</h3></div>
                  </td>
                </tr>
              }

            </tbody>
          </Table>
        </Container>
      </section>
    </>
  )
}

export default Index