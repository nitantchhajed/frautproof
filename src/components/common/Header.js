import React, { useState } from 'react';
import "../../assets/style/common/header.scss"
import { Navbar, Container, Nav, Image, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { BiPowerOff } from "react-icons/bi"
import { MdContentCopy } from "react-icons/md"
import { AiOutlineDownload, AiOutlineUpload } from "react-icons/ai"
import { useDisconnect } from 'wagmi'
import { CopyToClipboard } from 'react-copy-to-clipboard';
const HeaderNew = () => {
    const [copyTextSourceCode, setCopyTextSourceCode] = useState("Copy address to clipboard")
    const { address, isConnected } = useAccount();
    const { chain, chains } = useNetwork()
    const { disconnect } = useDisconnect()
    const { connect } = useConnect({
        connector: new InjectedConnector({ chains }),
    })
    const handleDisconnect = async () => {
        disconnect()
    }
    const handleSourceCopy = () => {
        if (copyTextSourceCode === "Copy address to clipboard") {
        }
    }
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {copyTextSourceCode}
        </Tooltip>
    );
    return (
        <>
            <header className='app_header'>
                <Navbar expand="lg" variant="dark">
                    <Container fluid>
                        <Link to="/" className='app_logo'>
                            <Image src={logo} alt="logo" fluid />
                        </Link>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                            </Nav>
                            {/* <div className='header_btn_wrap'>
                                <button className='btn disconnect_btn header_btn me-2'>Connect Wallet</button> 
                            </div> */}

                            <div className='dropdown_wrap'>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="race_header_dropdown" >
                                        0x34y3...0x34y3
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className='user_profile_wrap'>
                                            <figure className='user_profile'>
                                                <Image src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsElEQVRYR2PslBX+z4AHHLiVgiLroDYHn3IGUtUzjjpg0IUAehyiRzipaYCQfow0MOoAuoeA5/dylHIAPY7RHWSt9Q5vOXD0mhDecgPdPMZRBwx4CJBaEOFNAFgkCZUbJNcFow4YDYHREBjwEKC0LkD3AMnlwKgDqB4CLYqpKO0BQvX5b5YgvOmQ9c86FHlC7QnGUQcMeAigN0jQIxg90aGnEUrVY7QJKTWQVAePOgAAXAoAZIiZ6M4AAAAASUVORK5CYII=' alt="Profile Icon" />
                                            </figure>
                                            <h4>   0x34y3...0x34y3 <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 250 }}
                                                    overlay={renderTooltip}>
                                                    <CopyToClipboard text={address}>
                                                        <span className="d-inline-block"><MdContentCopy onClick={handleSourceCopy} /> </span>
                                                    </CopyToClipboard>
                                                </OverlayTrigger>
                                            </h4>
                                        </div>
                                        <Dropdown.Item as={Link} to="/history"><AiOutlineDownload /> View History</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDisconnect()}><BiPowerOff /> Disconnect</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> 
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    )
}
export default HeaderNew