import React from 'react'
import "../../../assets/style/pages/landing/home.scss";
import { Form, Button } from "react-bootstrap";
import { Ethereum } from 'react-web3-icons';
const Home = () => {
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
                            <Form.Control type="number" name='amount' placeholder='0' />
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
                        <Form.Control type="text" name='address' placeholder='address' />
                    </div>
                </div>
                <div className='challenge_btn_wrap'>
                    <Button className='btn challenge_btn'>Connect Wallet</Button>
                </div>
            </section>
        </>
    )
}

export default Home