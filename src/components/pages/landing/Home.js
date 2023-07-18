import React from 'react'
import "../../../assets/style/pages/landing/home.scss";
import { Form, Button, Image } from "react-bootstrap";
import { Ethereum } from 'react-web3-icons';
import { useState, useEffect } from 'react';
import { challengeABI } from '../../../challengeContract';
import { useAccount, useNetwork, useConnect, useSwitchNetwork, useBalance } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import Web3 from 'web3';
import TxTable from './TxTable';
import Loader from '../../common/Loader';
import metamask from "../../../assets/images/metamask.svg"
const Home = () => {

    //============================================================== HOOKS ===============================================================
    const web3 = new Web3(window.ethereum)
    const { address, isConnected } = useAccount();
    const { chain, chains } = useNetwork();
    const [sendStatus, setSendStatus] = useState(false)
    const [newState, setNewState] = useState(false)
    const [loader, setLoader] = useState(false)
    const [weekValue, setWeekValue] = useState(0);
    const [metaMastError, setMetaMaskError] = useState("");
    const [checkMetaMask, setCheckMetaMask] = useState(false);
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        connector: new InjectedConnector({ chains }), onError(error) {
            console.log('Error', error)
        },
        onMutate(args) {
            console.log('Mutate', args)
            if (args.connector.ready === true) {
                setCheckMetaMask(false)
            } else {
                setCheckMetaMask(true)
                console.log("fgsakdfjkBLdfK:LJBdu");
            }
        },
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
        onSuccess(data) {
            console.log('Success', data)
        },

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
            try {
                window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: "0x15f91",
                        rpcUrls: ["https://racetestnet.io"],
                        chainName: "RACE TESTNET",
                        nativeCurrency: {
                            name: "ETHEREUM",
                            symbol: "ETH",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://testnet.racescan.io"]
                    }]
                }).then((data) => {
                    if(data){
                        setMetaMaskError("")
                    }
                }).catch((err) => {
                    if (err.code === -32002) {
                        setMetaMaskError("Request stuck in pending state")
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        },
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    //  ========================================= Switch network function =========================================
    const handleSwitch = () => {
        switchNetwork(90001)
    }

    // convert value to Wei
    function toWei(tokenAmount) {
        return (Web3.utils.toWei(tokenAmount, "ether"));
    }

    // ========================================= Use Effect - fetching the Sent and received Transaction Data Array =========================================
    useEffect(() => {
        if (!checkMetaMask) {
            sender()
        }
    }, [address, sendStatus, newState, checkMetaMask])

    //------------------------------------------------------------------------------------------------------------------------------------

    //=========================================================== SEND FUNDS =============================================================

    async function sendETH() {
        try {
            console.log("recipient.charAt(2) ", typeof recipient, recipient, recipient.slice(0, 2), "recipient.length", recipient.length);
            if (ethValue) {
                setAmountError("")
                if (!recipient) {
                    setAddressError("Please Enter Wallet Address")
                } else {
                    if (recipient.slice(0, 2) !== "0x" || recipient.length != 42) {
                        setAddressError("Please Enter Valid Wallet Address")
                    } else {
                        setAddressError("")
                        const toWaiValue = toWei(ethValue)
                        setLoader(true)
                        const send = await CONTRACT_INSTANCE.methods.sendFunds(recipient, weekValue).send({ from: address, value: toWaiValue })
                        setLoader(false)
                        setSendStatus(true)
                    }
                }
            } else {
                setAmountError("Please Enter Amount")
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    }

    // --------------------------------------------------------------------------------------------------------------------------------------------

    // =========================================================== SENDER TRANSACTION DATA =============================================================

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

    // ============================================== Challenge Period Time ==============================================

    const challengePeriodTime = ({ target: { value } }) => {
        setWeekValue(Number(value))
    }

    // --------------------------------------------------------------------------------------------------------------------------------------------

    // ============================================== Wallet Address OnChange ==============================================
    const walletAddressChange = ({ target: { value } }) => {
        setRecipient(value)
        if (!value) {
            setAddressError("Please Enter Wallet Address")
        } else if (value.slice(0, 2) !== "0x" || value.length != 42) {
            setAddressError("Please Enter Valid Wallet Address")
        } else {
            setAddressError("")
        }
    }

    // --------------------------------------------------------------------------------------------------------------------------------------------

    // ============================================== ETH Value OnChange ==============================================

    const valueChange = ({ target: { value } }) => {
        setEthValue(value)
        if (!value) {
            setAmountError("Please Enter Amount")
        } else {
            setAmountError("")
        }
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
                            <Form.Control value={ethValue} onChange={valueChange} type="number" name='amount' placeholder='0' min="0s" />
                            <div className='amount_icon'>
                                <Ethereum />
                            </div>
                        </div>
                    </div>
                    <div className='challenge_wrap'>
                        <div className='challenge_dropdown'>
                            <Form.Select aria-label="Default select example" onChange={challengePeriodTime}>
                                <option value="0">1 Week</option>
                                <option value="1">2 Week</option>
                                <option value="2">4 Week</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
                <small className='text-danger'>{amountError}</small>
                <div className='receiver_wrap'>
                    <h5>Receiver Address</h5>
                    <div className='receiver_input_wrap'>
                        <Form.Control type="text" name='address' value={recipient} onChange={walletAddressChange} placeholder='0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' />
                    </div>
                    <small className='text-danger'>{addressError}</small>
                </div>
                <div className='challenge_btn_wrap'>
                    {checkMetaMask ? <a className='btn challenge_btn' href='https://metamask.io/' target='_blank'><Image src={metamask} alt="metamask icn" fluid /> Please Install Metamask Wallet</a> : !isConnected ? <Button className='btn challenge_btn' onClick={() => connect()}>Connect Wallet</Button> : chain.id !== 90001 ? <button className='btn challenge_btn' onClick={handleSwitch}>Switch to RACE Testnet</button> : loader ? <Button className='btn challenge_btn' disabled><Loader /></Button> : <Button className='btn challenge_btn' onClick={sendETH}>Send</Button>}
                </div>
                {metaMastError && <small className="d-block text-danger text-center mt-2">{metaMastError}</small>}
            </section>
            <TxTable sentTxn={sentTxn} setNewState={setNewState} />
        </>
    )
}

export default Home