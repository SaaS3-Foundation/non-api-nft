import React from 'react';

const images = props => {

  return (
    <div style={{display:'flex',flexDirection:'column'}}>
        {props.nfts.map((nft, key) => {
            return(
                <div key={key} style={{display:'flex',flexDirection:'row', textAlign: 'left'}}>
                    <div style={{marginRight: '2em'}}><b>Algorithm NFT {key+1}</b> {nft.fileName}</div>
                    <a href={"https://ipfs.io/ipfs/" + nft.fileHash} target="_blank" rel="noreferrer">
                      {nft.fileName}:{nft.fileHash}
                    </a>
                </div>
            )
        })}
    </div>
  );

}

export default images;