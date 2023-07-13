import React, { useEffect, useState } from 'react'
import { useAccount } from "wagmi";
import { challengeABI } from '../../../challengeContract';
import Web3 from "web3";
import { Container, Button, Table } from "react-bootstrap";
const Index = () => {

  //============================================================== HOOKS ===============================================================

  const web3 = new Web3(window.ethereum)
  const [receiverTxn, setReceiverTxn] = useState([])
  const { address } = useAccount();
  useEffect(() => {
    received()
  }, [])
  //------------------------------------------------------------------------------------------------------------------------------------

  //=========================================================== CONTRACT ===============================================================

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
  const contractABI = challengeABI
  const CONTRACT_INSTANCE = new web3.eth.Contract(contractABI, contractAddress)

  //------------------------------------------------------------------------------------------------------------------------------------

  //=========================================================== RECEIVER TRANSACTION DATA =============================================================

  const received = async () => {
    const receiverData = await CONTRACT_INSTANCE.methods.viewTransactionsByRecipient().call({ from: address })
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

  async function claim(id) {
    const claimTxn = await CONTRACT_INSTANCE.methods.claimTransaction(id).send({ from: address })
    console.log({ claimTxn });
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      <section className="claimTable_wrap">
        <Container fluid>
          <div className="claimTable-title">
            <h6 className="text-light">RECENT TRANSACTION</h6>
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
              {
                receiverTxn.map((event, key) => {
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
                      <td>{!isCompleted && <div className="challenge_btn_wrap"><Button type="button" className="btn challenge_btn" onClick={() => claim(id)}>Claim</Button></div>}</td>
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

export default Index