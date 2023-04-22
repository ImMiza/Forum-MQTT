// @ts-ignore
import styled from "styled-components";

const sendIcon = require('../../images/send.svg');
const crossIcon = require('../../images/cross.svg');
const invitationIcon = require('../../images/invitation.svg');

const Container = styled.div`
  with: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #eeeeee;
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
`;

const PanelContainer = styled.div`
  height: 80%;
  width: 20%;
  background-color: white;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

interface ITopic {
    selected: boolean
}

const TopicButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5%;
  position: absolute;
  bottom: 0;
  cursor: pointer;
`;

const Delete = styled.div`
  background-image: url(${crossIcon});
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  filter: invert(59%) sepia(88%) saturate(6875%) hue-rotate(353deg) brightness(90%) contrast(94%);
`;

const Invitation = styled.div`
  background-image: url(${invitationIcon});
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 10px;
`;

const TopicContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface INotification {
    isActive: boolean
}

const Notification = styled.p<INotification>`
  color: white;
  background-color: ${p => p.isActive ? '#53566C' : 'white'};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`;

const Topic = styled.p<ITopic>`
  font-size: 1.1rem;
  padding: 10px;
  margin: 15px;
  background-color: ${p => p.selected ? 'red' : 'transparent'};
  cursor: pointer;
  border-radius: 20px;
`;

const ChatContainer = styled.div`
  width: 50%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chat = styled.div`
  width: 100%;
  height: 85%;
  background: white;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow-y: auto;
`;

interface IMessageContainer {
    isRight?: boolean
}

const MessageContainer = styled.div<IMessageContainer>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${p => p.isRight ? 'right' : 'left'};
`;

interface IMessageBlock {
    backgroundColor: string
    clickable: boolean
}

const MessageBlock = styled.div<IMessageBlock>`
  width: 50%;
  height: 150px;
  border-radius: 20px;
  max-width: 50%;
  height: fit-content;
  margin: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: ${p => p.backgroundColor};
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  cursor: ${p => p.clickable ? 'pointer' : 'initial'};
`;

const MessageTitle = styled.p`
  width: 100%;
  font-size: 1.1rem;
  text-align: center;
`;

const MessageContent = styled.p`
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: space-between;
`;

const Sender = styled.button`
  width: 10%;
  height: 100%;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  background: url(${sendIcon});
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const InputText = styled.input`
  width: 85%;
  border: none;
  border-radius: 20px;
  height: 100%;
  font-size: 1.1rem;
  outline: none;
  padding: 0 10px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
`;

export {
    Container,
    PanelContainer,
    ChatContainer,
    InputText,
    Chat,
    InputContainer,
    Sender,
    MessageContainer,
    MessageContent,
    MessageBlock,
    MessageTitle,
    Delete,
    Topic,
    TopicButton,
    TopicContainer,
    Notification,
    Invitation
}