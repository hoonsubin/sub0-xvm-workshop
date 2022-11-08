import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Web3 from "web3";

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
    //todo: also check if it's a valid SS58 address
    if (Web3.utils.isAddress(input)) {
      setAddress(input);
      setIsValidInput(true);
    } else {
      if (isValidInput) setIsValidInput(false);
    }
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label={inputLabel}
        variant="outlined"
        onChange={(input) => handleOnInput(input.target.value)}
      />
      {/* Check if the input address is SS58 or H160. If SS58, it will convert it to H160 and read the balance*/}
      <Button
        onClick={() => {
          handleOnClick(addressInput);
        }}
        disabled={!isValidInput}
      >
        {buttonLabel}
      </Button>
    </>
  );
};

export default AddressInput;
