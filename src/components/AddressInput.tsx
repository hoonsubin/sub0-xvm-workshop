import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import * as polkaUtilsCrypto from "@polkadot/util-crypto";
import * as polkaUtils from "@polkadot/util";

type Props = {
  inputLabel: string;
  buttonLabel: string;
  onClick: (input: string) => void;
};

const AddressInput = ({ inputLabel, buttonLabel, onClick }: Props) => {
  const [addressInput, setAddress] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);

  const handleOnClick = (address: string) => {
    onClick(address);
  };

  const handleOnInput = (input: string) => {
    // check if the input is a valid ethereum or Substrate address
    if (polkaUtilsCrypto.isEthereumAddress(input) || polkaUtilsCrypto.isAddress(input)) {
      setAddress(input);
      setIsValidInput(true);
    } else {
      if (isValidInput) setIsValidInput(false);
    }
  };

  return (
    <>
      <FormControl fullWidth style={{margin: '10px'}}>
        <TextField
          id="outlined-basic"
          label={inputLabel}
          variant="outlined"
          onChange={(input) => handleOnInput(input.target.value)}
        />
      </FormControl>

      {/* Check if the input address is SS58 or H160. If SS58, it will convert it to H160 and read the balance*/}
      <FormControl fullWidth style={{margin: '10px'}}>
        <Button
          variant="contained"
          onClick={() => {
            handleOnClick(addressInput);
          }}
          disabled={!isValidInput}
        >
          {buttonLabel}
        </Button>
      </FormControl>
    </>
  );
};

export default AddressInput;
