import { ethers } from "ethers";
import { useEffect, useState } from "react";


export default function useExternalContractLoader(provider, address, ABI, optionalBytecode) {
  const [contract, setContract] = useState();
  useEffect(() => {
    async function loadContract() {
      if (typeof provider !== "undefined" && address && ABI) {
        try {
          // we need to check to see if this provider has a signer or not
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const customContract = new ethers.Contract(address, ABI, signer);
          if (optionalBytecode) customContract.bytecode = optionalBytecode;

          setContract(customContract);
        } catch (e) {
          console.log("ERROR LOADING EXTERNAL CONTRACT AT " + address + " (check provider, address, and ABI)!!", e);
        }
      }
    }
    loadContract();
  }, [provider, address, ABI, optionalBytecode]);
  return contract;
}
