import React from 'react';
import Identicon from 'identicon.js';

const header = props => {

  return (
    <nav className="navbar navbar-dark bg-dark p-0 text-monospace">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="https://deainet.io"
        target="_blank"
        rel="noopener noreferrer"
      >
      non-API Algorithm NFT
      </a>
      <ul className="navbar-nav px-3">
        <li>
          <medium>
            <a
              className="text-white"
              href={"https://etherscan.io/address/" + props.account}
              alt=""
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.account.substring(0,6)}...{props.account.substring(38,42)}
            </a>
          </medium>
          {(props.account) ?
              <img
                className='ml-2'
                src={`data:image/png;base64,${new Identicon(props.account, 30).toString()}`}
                alt=""
                width='30'
                height='30'
              />
            : <span></span>
          }
        </li>
      </ul>
    </nav>
  );

}

export default header;
