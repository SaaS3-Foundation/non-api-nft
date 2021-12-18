import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Nft from '../abis/Nft.json';
import Header from './Header';
import Form from './Form';
import Images from './Images';

const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

function App() {

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);
  const [buffer, setBuffer] = useState(null);
  const [name, setName] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeb3();
    loadBlockchain();
    setInterval(()=>{
          loadBlockchain();
      console.log('xxx');
        },1000)
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
  }

  const loadBlockchain = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId()
    const networkData = Nft.networks[networkId]
    if(networkData) {
      const abi = Nft.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract);
      const totalSupply = await contract.methods.totalSupply().call()
      let nftsToSet = []
      for (var i = 1; i <= totalSupply; i++) {
        const nft = await contract.methods.nfts(i - 1).call()
        nftsToSet.push(nft);
      }
      setNfts(nftsToSet);
    }
  }

  const readImage = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      setType(file.type);
      setName(file.name)
    }
  }

  const mintImage = () => {
    ipfs.add(buffer).then(result => {
      setLoading(true);
      if(type === ''){
        setType('text/plain');
      }
      contract.methods.mint(name, result.path, type||'text/plain', result.size).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
        setType(null);
        setName(null);
        window.location.reload()

      }).on('error', (err) =>{
        window.alert('Error', err)
        setLoading(false);
      })
    }).catch(err => {
      console.log("err", err)
    })
  }

  return (
    <>
      <Header account={account} />
      {(loading) ?
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        : <div className="container-fluid mt-5 text-center">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
                <div className="content">
                  <Form 
                    mintImage={mintImage}
                    readImage={readImage} 
                  />
                  <p>&nbsp;</p>
                  <Images nfts={nfts} />
                </div>
              </main>
            </div>
          </div>
      }
    </>
  );
}

export default App;