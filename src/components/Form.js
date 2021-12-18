import React from 'react';

const form = props => {

  return (
    <div className="card bg-dark mb-3 mx-auto" style={{ maxWidth: '512px' }}>
        <h2 className="text-white bg-dark text-monospace"><b><ins>Mint an non-API NFT and Upload to IPFS</ins></b></h2>
        <p>&nbsp;</p>
        <form onSubmit={(event) => {
            event.preventDefault()
            props.mintImage()
        }}>
            <input type="file" onChange={props.readImage} className="text-white text-monospace" accept=".py, .js, .c, .cpp, .html,.sol"/>
            <p>&nbsp;</p>
            <button type="submit" className="btn-primary btn-block"><b>Mint</b></button>
        </form>
    </div>
  );

}

export default form;