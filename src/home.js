import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import {contractApi,contractAddress} from './constant';
const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [refundUserAddress, setRefundUserAddress] = useState('');

  const contractAddress = 'YOUR_CONTRACT_ADDRESS';
  const contractABI = [/* ABI array from Remix */];

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);
      } else {
        alert('Please install MetaMask to use this dApp.');
      }
    };
    initWeb3();
  }, []);

  const purchaseInsurance = async () => {
    await contract.methods.purchaseInsurance().send({ from: accounts[0], value: web3.utils.toWei(purchaseAmount, 'ether') });
  };

  const claimInsurance = async () => {
    await contract.methods.claimInsurance(web3.utils.toWei(claimAmount, 'ether')).send({ from: accounts[0] });
  };

  const updateInsuranceAmount = async () => {
    await contract.methods.updateInsuranceAmount(userAddress, web3.utils.toWei(newAmount, 'ether')).send({ from: accounts[0] });
  };

  const refundExcessInsurance = async () => {
    await contract.methods.refundExcessInsurance(refundUserAddress).send({ from: accounts[0] });
  };

  return (
    <div className="container">
      <h1>Medical Insurance</h1>
      <div>
        <h2>Purchase Insurance</h2>
        <input
          type="number"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
          placeholder="Enter amount in ETH"
        />
        <button onClick={purchaseInsurance}>Purchase</button>
      </div>
      <div>
        <h2>Claim Insurance</h2>
        <input
          type="number"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
          placeholder="Enter claim amount in ETH"
        />
        <button onClick={claimInsurance}>Claim</button>
      </div>
      <div>
        <h2>Update Insurance Amount (Owner only)</h2>
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="Enter user address"
        />
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Enter new amount in ETH"
        />
        <button onClick={updateInsuranceAmount}>Update</button>
      </div>
      <div>
        <h2>Refund Excess Insurance (Owner only)</h2>
        <input
          type="text"
          value={refundUserAddress}
          onChange={(e) => setRefundUserAddress(e.target.value)}
          placeholder="Enter user address"
        />
        <button onClick={refundExcessInsurance}>Refund</button>
      </div>
    </div>
  );
};

export default App;
