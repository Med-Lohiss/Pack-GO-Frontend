import styled from "styled-components";
import { Link } from "react-router-dom";

const primaryBlue = "#1976d2";
const secondaryBlue = "#1565c0";
const accentBlue = "#64b5f6";
const lightBlue = "#e3f2fd";

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    position: relative;
    margin: 30px;
  }
`;

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  width: 50%;
  opacity: 0;
  transition: all 0.6s ease-in-out;

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
  `}

  @media (max-width: 768px) {
    position: absolute;
    top: 35%;
    left: 0;
    width: 100%;
    height: 70%;
    transform: translateY(${({ signin }) => (signin ? "-100%" : "0")});
    opacity: 1;
    z-index: ${({ signin }) => (signin ? "1" : "3")};
  }
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  width: 50%;
  z-index: 2;
  transition: all 0.6s ease-in-out;

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(100%);
  `}

  @media (max-width: 768px) {
    position: absolute;
    top: 30%;
    left: 0;
    width: 100%;
    height: 70%;
    transform: translateY(${({ signin }) => (signin ? "0" : "100%")});
    z-index: ${({ signin }) => (signin ? "3" : "1")};
  }
`;

export const Form = styled.form`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 50px;
  height: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 0 20px;
    justify-content: center;
    margin-top: 35px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  color: ${props => (props.overlayTitle ? "#fff" : primaryBlue)}; /* Aquí cambiamos el color a blanco cuando es un título dentro del overlay */

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Input = styled.input`
  background-color: ${lightBlue};
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid ${primaryBlue};
  background-color: ${primaryBlue};
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active { transform: scale(0.95); }
  &:focus { outline: none; }

  @media (max-width: 768px) {
    padding: 5px 30px;
    font-size: 14px;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #fff;

  @media (max-width: 768px) {
    border-color:#fff;
    color: #fff;
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(-100%);
  `}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: 30%;
    left: 0;
    top: 0;
    transform: none;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
`;

export const Overlay = styled.div`
  background: linear-gradient(to right, ${primaryBlue}, ${accentBlue});
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(50%);
  `}

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    height: 100%;
    transform: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50%;
    transition: transform 0.6s ease-in-out;
  }
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(0);
  `}

  @media (max-width: 768px) {
    transform: translateY(-100%);
    transform: translateY(${({ signin }) => (signin ? "100" : "40%")});
    z-index: ${({ signin }) => (signin ? "2" : "1")};
  }
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);

  ${({ signin }) =>
    signin !== true &&
    `
      transform: translateX(20%);
  `}

  @media (max-width: 768px) {
    transform: translateY(200%);
    transform: translateY(${({ signin }) => (signin ? "-40%" : "-100")});
    z-index: ${({ signin }) => (signin ? "1" : "2")};
  }
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  margin: 20px 0 30px;
  color: #e3f2fd;

  @media (max-width: 768px) {
    margin: 10px 0;
    font-size: 12px;
  }
`;

export const StyledImage = styled.img`
  display: block;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledRecoverLink = styled(Link)`
  margin-top: 10px;
  text-decoration: none;
  color: ${primaryBlue};
  font-size: 14px;
  transition: color 0.3s ease;

  &:hover {
    color: ${accentBlue};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;
