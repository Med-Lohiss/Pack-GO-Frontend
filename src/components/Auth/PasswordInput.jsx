import React, { useState } from "react";
import styled from "styled-components";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  background-color: #e3f2fd;
  color: #000;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  padding-right: 40px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }
`;

const PasswordInput = ({ name, placeholder, required, minLength }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordWrapper>
      <StyledInput
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength} 
      />
      <ToggleButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </ToggleButton>
    </PasswordWrapper>
  );
};

export default PasswordInput;
