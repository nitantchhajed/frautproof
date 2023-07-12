import React from 'react'
import "../../../assets/style/pages/landing/home.scss";
import { Form, Button } from "react-bootstrap";
import { Ethereum } from 'react-web3-icons';
import { useState, useEffect } from 'react';
import { challengeABI } from '../../../challengeContract';
import { useAccount, useNetwork, useConnect, useSwitchNetwork } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import Web3 from 'web3';
import TxTable from './TxTable';
const Home = () => {
    const web3 = new Web3(window.ethereum)
    const { address, isConnected } = useAccount();
    const { chain, chains } = useNetwork()
    const { connect } = useConnect({
        connector: new InjectedConnector({ chains }),
    })
    const [recipient, setRecipient] = useState("")
    const [ethValue, setEthValue] = useState("")
    const [sentTxn, setSentTxn] = useState([])
    useEffect(() => {

    }, [])


    //=========================================================== CONTRACT ============================================================
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const contractABI = challengeABI
    const CONTRACT_INSTANCE = new web3.eth.Contract(contractABI, contractAddress)
    //=================================================================================================================================

    //=========================================================== SEND FUNDS ==========================================================
    async function sendETH() {
        try {
            const toWaiValue = toWei(ethValue)
            console.log(toWaiValue, address);
            const send = await CONTRACT_INSTANCE.methods.sendFunds(recipient).send({ from: address, value: toWaiValue })
            console.log({ send });

        } catch (error) {
            console.log(error);
        }
    }

    // async function challengeTxn() {
    //     const challenge = await CONTRACT_INSTANCE.methods.revertTransaction(id).send({ from: WalletAddress })
    //     console.log({ challenge });
    // }

    // async function claim() {
    //     const claimTxn = await CONTRACT_INSTANCE.methods.claimTransaction(id).send({ from: WalletAddress })
    //     console.log({claimTxn});
    // }

    const sender = async () => {
        const senderData = await CONTRACT_INSTANCE.methods.viewTransactionsBySender().call({ from: address })
        let sentTxnData = []
        for (let index = 0; index < senderData.length; index++) {
            const element = senderData[index];
            const TxnData = await CONTRACT_INSTANCE.methods.allTransactions(element).call({ from: address })
            sentTxnData.push(TxnData)
        }
        
        setSentTxn(sentTxnData)
        console.log("sentTxnData", sentTxnData);
    }

    const received = async () => {
        const receiverData = await CONTRACT_INSTANCE.methods.viewTransactionsByRecipient().call({ from: address })
        let receivedTxnData = []
        for (let index = 0; index < receiverData.length; index++) {
            const element = receiverData[index];
            const TxnData = await CONTRACT_INSTANCE.methods.allTransactions(element).call({ from: address })
            receivedTxnData.push(TxnData)
            // setSentTxn((oldData)=>[TxnData, ...oldData])
        }

        console.log("receivedTxnData", receivedTxnData);
    }

    useEffect(() => {
        sender()
        received()
    }, [])

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
    const handleSwitch = () => {
        switchNetwork(90001)
    }













    function toWei(tokenAmount) {
        return (Web3.utils.toWei(tokenAmount, "ether"));
    }
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
                                <option value="1hr">1 Hr</option>
                                <option value="1day">1 Day</option>
                                <option value="1week">1 Week</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
                <div className='receiver_wrap'>
                    <h5>Receiver Address</h5>
                    <div className='receiver_input_wrap'>
                        <Form.Control type="text" name='address' value={recipient} onChange={({ target: { value } }) => setRecipient(value)} placeholder='address' />
                    </div>
                </div>
                <div className='challenge_btn_wrap'>
                    {!isConnected ? <Button className='btn challenge_btn' onClick={() => connect()}>Connect Wallet</Button> : chain.id !== 90001 ? <button className='btn challenge_btn' onClick={handleSwitch}>Switch to RACE Testnet</button> : <Button className='btn challenge_btn' onClick={sendETH}>Send</Button>}
                </div>
            </section>
            <TxTable sentTxn={sentTxn}/>
        </>
    )
}

export default Home