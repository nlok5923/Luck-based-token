import React from "react"
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import "./App.scss"
import { useState, useEffect } from "react"
import { ethers } from 'ethers';
import contractArtifact from "./ethereum/Nitanshu.json";
import toast, { Toaster } from "react-hot-toast";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Rings } from "react-loader-spinner";

const App = () => {

  const [ethAmount, setEthAmount] = React.useState(0)
  const [currentAddress, setCurrentAddress] = useState('');
  const [etherProvider, setEtherProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('0x48C2744bf1f31Eb1820E83636967B038e363e1B7');
  const [ethToUsd, setEthToUsd] = useState(0);
  const [token, setTokens] = useState(0);
  const [tokenToWithdraw, setTokenToWithdraw] = useState(0);
  const [isLoad, setIsLoad] = useState(false);

  const _raiseError = () => {
    // need to notify user
    toast.error("Prolly you'll need metamask!");
  }

  const _initEthers = async () => {
    let ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    setEtherProvider(ethProvider);
    let contractInstance = new ethers.Contract(contractAddress, contractArtifact.abi, ethProvider.getSigner(0));
    setContract(contractInstance);
  }

  const _setCurrentAddress =  async () => {
    if (window.ethereum === undefined) {
      _raiseError();
      return;
    }
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(selectedAddress);
    setCurrentAddress(selectedAddress)
    if(selectedAddress !== '') {
     await _initEthers();
    }
    window.ethereum.on("accountsChanged", async ([newAddress]) => {
      if (newAddress === undefined) {
        return this._resetState();
      }
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAddress(selectedAddress);
    });
  } 

  useEffect(() => {
    _setCurrentAddress();
    console.log("called");
  }, [])

  const stakeEth = async () => {
    try {
      console.log(" this is eth amount", ethAmount);
      let transaction = await contract.checkMyLuck(ethAmount, { gasLimit: 1000000 });
      setIsLoad(true);
      let receipt = await transaction.wait();
      console.log("this is a receipt", receipt)
      setIsLoad(false);
      toast.success("Congratulations!!, You got some token");
    } catch(err) {
      console.log(err);
      toast.error("Probably you had a back luck now !!");
    }
  }

  return (
    <div>
      <Toaster />
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="content">
        <input type="number" name="ethAmount" className="mail" required placeholder="Enter no of tokens you want !!" onChange={e => setEthAmount(e.target.value)} /> <br />
        <button className="btn" onClick={() => stakeEth()} > Check My Luck </button>
      </div>
      <div className="loader">
      {isLoad && <Rings color="rgb(230, 182, 230)" height={80} width={80} />}
      </div>
    </div>
  );
}

export default App;
