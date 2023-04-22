import styled from "styled-components";

export const Background = styled.div`
  background-color: black;
  opacity: 0.4;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
`;

export const Container = styled.div`
  background-color: white;
  position: fixed;
  width: 30%;
  height: 30%;
  top: 30%;
  left: 30%;
  transform: translate(30%, -30%);
  z-index: 11;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const Title = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
`;

export const InputText = styled.input`
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  outline: none;
  padding: 0 10px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  width: 90%;
  height: 10%;
  margin-right: 10px;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 50%;
  overflow-y: auto;
`;

export const SelectBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const InputSelect = styled.input`
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  width: 20px;
  height: 20px;
  margin: 10px 0;
`;

export const Name = styled.p`
  font-size: 1rem;
  font-weight: 400;
  margin-left: 10px;
`;

export const Button = styled.button`
  transition: all 0.4s;
  width: 30%;
  height: 10%;
  border: none;
  border-radius: 5px;
  margin-top: 0.5%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  background: white;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }
`;