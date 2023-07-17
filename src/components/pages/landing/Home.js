import React from 'react'
import "../../../assets/style/pages/landing/home.scss";
import { Form, Button } from "react-bootstrap";
import { Ethereum } from 'react-web3-icons';
import { useState, useEffect } from 'react';
import { challengeABI } from '../../../challengeContract';
import { useAccount, useNetwork, useConnect, useSwitchNetwork, useBalance } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import Web3 from 'web3';
import TxTable from './TxTable';
import Loader from '../../common/Loader';
const Home = () => {

    //============================================================== HOOKS ===============================================================
    const web3 = new Web3(window.ethereum)
    const { address, isConnected } = useAccount();
    const { chain, chains } = useNetwork();
    const [sendStatus, setSendStatus] = useState(false)
    const [newState, setNewState] = useState(false)
    const [loader, setLoader] = useState(false)
    const { connect } = useConnect({
        connector: new InjectedConnector({ chains }),
    })
    const [recipient, setRecipient] = useState("")
    const [ethValue, setEthValue] = useState("")
    const [sentTxn, setSentTxn] = useState([])
    const [amountError, setAmountError] = useState("")
    const [addressError, setAddressError] = useState("")
    //------------------------------------------------------------------------------------------------------------------------------------

    //=========================================================== CONTRACT ===============================================================

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const contractABI = challengeABI
    const CONTRACT_INSTANCE = new web3.eth.Contract(contractABI, contractAddress)

    //------------------------------------------------------------------------------------------------------------------------------------


    //=========================================================== UTILITY FUNCTIONS ===============================================================
    // Switch Network Hook
    const { switchNetwork } = useSwitchNetwork({
        throwForSwitchChainNotSupported: true,
        onError(error) {
            console.log('Error', error)
        },
        onMutate(args) {
            console.log('Mutate', args)
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    // Switch network function
    const handleSwitch = () => {
        switchNetwork(90001)
    }

    // convert value to Wei
    function toWei(tokenAmount) {
        return (Web3.utils.toWei(tokenAmount, "ether"));
    }

    //Use Effect - fetching the Sent and received Transaction Data Array
    useEffect(() => {
        sender()
    }, [address, sendStatus, newState])

    //------------------------------------------------------------------------------------------------------------------------------------

    //=========================================================== SEND FUNDS =============================================================

    async function sendETH() {
        try {
            if (ethValue) {
                setAmountError("")
                if (recipient) {
                    setAddressError("")
                    const toWaiValue = toWei(ethValue)
                    console.log(toWaiValue, address);
                    setLoader(true)
                    const send = await CONTRACT_INSTANCE.methods.sendFunds(recipient).send({ from: address, value: toWaiValue })
                    console.log({ send });
                    setLoader(false)
                    setSendStatus(true)
                } else {
                    setAddressError("Please Enter Wallet Address")
                }
            }else{
                setAmountError("Please Enter Amount")
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------

    //=========================================================== SENDER TRANSACTION DATA =============================================================

    const sender = async () => {
        const senderData = await CONTRACT_INSTANCE.methods.viewTransactionsBySender().call({ from: address })
        let sentTxnData = []
        for (let index = 0; index < senderData.length; index++) {
            const element = senderData[index];
            const TxnData = await CONTRACT_INSTANCE.methods.allTransactions(element).call({ from: address })
            sentTxnData.push(TxnData)
        }
        setSentTxn(sentTxnData)
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <>
            <section className='home_wrap'>
                <div className='home_title'>
                    <h3>RACE Dapp</h3>
                </div>
                <div className='challenge_title_wrap'>
                    <div className='amount_title'>
                        <h5>Amount</h5>
                        <span>RACE Chain</span>
                    </div>
                    <div className='challenge_period'>
                        <h5>Challenge Period</h5>
                    </div>
                </div>
                <div className='challenge_main_wrap'>
                    <div className='amount_wrap'>
                        <div className='amount_input_wrap'>
                            <Form.Control value={ethValue} onChange={({ target: { value } }) => setEthValue(value)} type="number" name='amount' placeholder='0' min="0s" />
                            <div className='amount_icon'>
                                <Ethereum />
                            </div>
                        </div>
                    </div>
                    <div className='challenge_wrap'>
                        <div className='challenge_dropdown'>
                            <Form.Select aria-label="Default select example">
                                <option value="1hr">1 Week</option>
                                <option value="1day">2 Week</option>
                                <option value="1week">4 Week</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
                <small className='text-danger'>{amountError}</small>
                <div className='receiver_wrap'>
                    <h5>Receiver Address</h5>
                    <div className='receiver_input_wrap'>
                        <Form.Control type="text" name='address' value={recipient} onChange={({ target: { value } }) => setRecipient(value)} placeholder='0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' />
                    </div>
                    <small className='text-danger'>{addressError}</small>
                </div>
                <div className='challenge_btn_wrap'>
                    {!isConnected ? <Button className='btn challenge_btn' onClick={() => connect()}>Connect Wallet</Button> : chain.id !== 90001 ? <button className='btn challenge_btn' onClick={handleSwitch}>Switch to RACE Testnet</button> : loader ? <Button className='btn challenge_btn' disabled><Loader /></Button> : <Button className='btn challenge_btn' onClick={sendETH}>Send</Button>}
                </div>
            </section>
            <TxTable sentTxn={sentTxn} setNewState={setNewState} />
        </>
    )
}

export default Home