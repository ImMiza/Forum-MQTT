// @ts-ignore
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
`;

const ContainerLoading = styled(Container)`
  justify-content: center;
  align-items: center;
`;

const TextLoading = styled.p`
  margin-top: 2%;
  font-weight: 800;
  color: #565050;
  font-size: 2rem;
`;

const StatusText = styled.p`
  width: 100%;
  height: 5%;
  text-align: center;
`;

interface IStatusSpan {
    color: string
}

const StatusSpan = styled.span<IStatusSpan>`
  color: ${p => p.color};
  font-weight: bold;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`

`;

const InputText = styled.input`
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  outline: none;
  padding: 0 10px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  width: 90%;
  height: 100%;
  margin-right: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 30%;
  height: 5%;
  margin: 1% 0;
`;

const Button = styled.button`
  transition: all 0.4s;
  width: 15%;
  border: none;
  border-radius: 5px;
  margin-top: 0.5%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  background: white;
  cursor: pointer;
  padding: 10px;
  
  &:hover {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.p`
  margin-top: 2%;
  color: darkred;
`;

export {
    MainContainer,
    Title,
    InputText,
    Button,
    ErrorMessage,
    InputContainer,
    Container,
    TextLoading,
    StatusText,
    StatusSpan,
    ContainerLoading
}