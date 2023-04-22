import React from 'react';
import {
    Chat,
    ChatContainer,
    Container, Delete,
    InputContainer,
    InputText, Invitation, MessageBlock,
    MessageContainer, MessageContent, MessageTitle, Notification,
    PanelContainer,
    Sender, Topic, TopicButton, TopicContainer
} from "./MainStyle";
import mqtt from "mqtt";
import moment, {Moment} from "moment";
import uuid from "react-uuid";
import CreatePopup from "../../components/popup/CreatePopup";
import {Channel, Message, MessageType, User} from "../../interfaces/main";
import InvitationPopup from "../../components/popup/InvitationPopup";


function Main(props: {
    client: mqtt.MqttClient
}): JSX.Element {

    const personalTopic = `user/${props.client.options.clientId}`;
    const defaultTopic = 'channel/general';

    const ownUser: User = {id: props.client.options.clientId, username: props.client.options.username};

    const [channels, setChannels] = React.useState<Channel[]>([
        {
            id: uuid(),
            name: defaultTopic,
            messages: [],
            selected: true,
            type: 'topic'
        },
        {
            id: uuid(),
            name: personalTopic,
            messages: [{
                message: 'Tu peux t\'envoyer des messages à toi même si tu veux ici !',
                date: moment(),
                isMe: false,
                isRead: true,
                source: {id: props.client.options.clientId, username: props.client.options.username},
                type: 'info'
            }],
            type: 'user',
            source: {id: props.client.options.clientId, username: 'Moi'}
        }
    ]);

    const [currentMessage, setCurrentMessage] = React.useState<string>('');

    const [creationOpen, setCreationOpen] = React.useState<boolean>(false);
    const [invitationOpen, setInvitationOpen] = React.useState<boolean>(false);

    const [invitationChannel, setInvitationChannel] = React.useState<Channel>();

    /**
     * Handle the receipt message and parse them in channels/messages
     * @param topic the topic source
     * @param message the raw message
     */
    function handleMessage(topic: string, message: string) {
        const infos = message.toString().split(':|:');
        if (infos.length === 5) {
            let channel = channels.find(c => c.name === topic);
            if (channel) {
                if (channel.type === 'user') {
                    channel = channels.find(c => c.name === topic && c.source !== undefined && c.source.id === infos[0]);
                }

                if (channel) {
                    const message: Message = {
                        message: infos[4],
                        date: moment(),
                        isMe: props.client.options.clientId === infos[0],
                        isRead: channel.selected,
                        source: {id: infos[0], username: infos[1]},
                        type: infos[2]
                    } as Message;

                    if (infos[2] as MessageType === 'button') {
                        const params = JSON.parse(infos[3]);
                        if (params.invitation) {
                            message.action = parseInvitation(params.invitation, {id: infos[0], username: infos[1]});
                        }
                    }

                    channel.messages.push(message);

                    setChannels((prev) => prev.map(c => c.id === channel.id ? {...channel} : c));

                    if (props.client.options.clientId !== infos[0] && !channels.find(c => c.name === personalTopic && c.source !== undefined && c.source.id === infos[0])) {
                        setChannels((prev) => prev.concat({
                            id: uuid(),
                            name: personalTopic,
                            messages: [],
                            source: {id: infos[0], username: infos[1]},
                            type: 'user'
                        }));
                    }
                }
            }
        }
    };

    /**
     * Init the subscription in general topic and your own personal topic
     */
    React.useEffect(() => {
        props.client.subscribe(defaultTopic);
        props.client.subscribe(personalTopic);
        sendMessage(getSelectedChannel(), `${props.client.options.username} est la !`, {type: 'info'});
    }, []);


    /**
     * Init and manage the handler and channels
     */
    React.useEffect(() => {
        props.client.on('message', handleMessage);

        setChannels((prev) => {
            const newChannels: Channel[] = [];
            prev.forEach(c => {
                if (c.name === personalTopic) {
                    if (!newChannels.find(c2 => c2.name === personalTopic && c2.source !== undefined && c2.source.id === c.source.id)) {
                        newChannels.push(c);
                    }
                }
                else if (!newChannels.find(c2 => c2.id === c.id)) {
                    newChannels.push(c);
                }
            });
            return newChannels;
        });
        const chatContainer = document.getElementById('forum_chat');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
        }

        return () => {
            props.client.off('message', handleMessage);
        };
    }, [JSON.stringify(channels)]);


    /**
     * Send a formatted message into a topic
     * @param channel the topic target
     * @param message the raw message
     * @param options some option to complete the message
     */
    function sendMessage(channel: Channel | undefined, message: string, options?: { type?: MessageType, params?: Object }): void {
        if (channel) {
            message = message.trim().replaceAll(':|:', '');
            const extra = options ? {
                type: options.type ? options.type : 'raw',
                params: options.params ? options.params : {}
            } : {
                type: 'raw',
                params: {}
            };

            message = `${props.client.options.clientId}:|:${props.client.options.username}:|:${extra.type}:|:${JSON.stringify(extra.params)}:|:${message}`;

            if (channel.type === 'user' && channel.source !== undefined) {
                const topic = `user/${channel.source.id}`;
                channel.messages.push({
                    message: message.substring(message.lastIndexOf(':|:') + 3),
                    isRead: true,
                    date: moment(),
                    isMe: true,
                    source: {id: props.client.options.clientId, username: props.client.options.username},
                    type: 'raw'
                });
                setChannels((prev) => prev.map(c => c.id === channel.id ? {...channel} : c));
                props.client.publish(topic, message);
            } else {
                props.client.publish(channel.name, message);
            }
        }
    }

    /**
     * Change the selected topic
     * @param channel the topic target
     */
    function changeTopic(channel: Channel | undefined): void {
        if (channel) {
            setChannels((prev) => prev.map(c => c.id === channel.id ? {
                ...channel, selected: true,
                messages: channel.messages.map(m => {
                    m.isRead = true;
                    return m;
                })
            } : {
                ...c,
                selected: false
            }));
        }
    }

    /**
     * Get the current selected channel
     */
    function getSelectedChannel(): Channel | undefined {
        return channels.find(c => c.selected);
    }

    /**
     * Create a new channel and subscribe the topic
     * @param topic name of the new topic
     */
    function createChannel(topic: string): void {
        const newTopic = `channel/${props.client.options.clientId}/${topic}`;
        props.client.subscribe(newTopic);
        const channel: Channel = {
            id: uuid(),
            name: newTopic,
            messages: [],
            type: 'topic',
            removable: true,
            joinable: true
        };
        setChannels((prev) => prev.concat(channel));
        sendMessage(channel, "Nouveau salon créé ! Invite tes amis !", {type: 'info'});
    }

    /**
     * Delete an existant channel and unsubscribe the topic
     * @param channel
     */
    function deleteChannel(channel: Channel): void {
        setChannels((prev) => {
            const values = prev.filter(c => c.id !== channel.id);
            if (values.find(v => v.selected) === undefined && values.length > 0) {
                values[0].selected = true;
            }
            return values;
        });
        props.client.unsubscribe(channel.name);
        sendMessage(channel, `${props.client.options.username} est parti du topic !`, {type: 'info'});
    }

    /**
     * Parse a new invitation action, init the action to make when you click an invitation
     * @param invitation the topic name to subscribe
     * @param source the source of the invitation
     */
    function parseInvitation(invitation: string, source: User): (channels: Channel[]) => void {
        return (channels: Channel[]) => {
            if (channels.find(c => c.name === invitation)) {
                return;
            }

            const channel: Channel = {
                id: uuid(),
                name: invitation,
                messages: [],
                source,
                type: 'topic',
                removable: true,
            };
            setChannels((prev) => prev.concat(channel));
            props.client.subscribe(invitation);
            sendMessage(channel, `${props.client.options.username} a rejoint le topic !`, {type: 'info'});
        }
    }

    /**
     * Send a formatted invitation to a bunch of users
     * @param channel the channel target to invite
     * @param users the users to send an invitation
     */
    function sendInvitation(channel: Channel, users: User[]): void {
        const message = `${ownUser.username} vous a invitez à rejoindre le topic ${channel.name.substring(channel.name.lastIndexOf('/') + 1)} ! cliquer sur ce message pour rejoindre.`;
        users.forEach(u => {
            const c: Channel = channels.find(c => c.name === personalTopic && c.source !== undefined && c.source.id === u.id);
            if (c) {
                sendMessage(c, message, {type: 'button', params: {invitation: channel.name}});
            }
        });
    }

    return (
        <Container>
            {
                creationOpen &&
                <CreatePopup onCreate={(value) => {
                    setCreationOpen(false);
                    createChannel(value);
                }} onCancel={() => setCreationOpen(false)}
                />
            }
            {
                invitationOpen && invitationChannel !== undefined &&
                <InvitationPopup
                    channel={invitationChannel}
                    users={channels.filter(c => c.source !== undefined).map(c => c.source!)}
                    onCancel={() => setInvitationOpen(false)}
                    onConfirm={(values) => {
                        setInvitationOpen(false);
                        sendInvitation(invitationChannel, values);
                    }}
                />
            }
            <PanelContainer>
                {
                    channels.filter(c => c.type === 'topic').map(c => {
                        return (
                            <TopicContainer>
                                <Notification
                                    isActive={c.messages.find(m => !m.isRead) !== undefined}>{c.messages.filter(m => !m.isRead).length}</Notification>
                                <Topic onClick={() => changeTopic(c)}
                                       selected={c.selected}>{c.name.substring(c.name.lastIndexOf('/') + 1)}</Topic>
                                {
                                    c.removable &&
                                    <Delete onClick={() => deleteChannel(c)}/>
                                }
                                {
                                    c.joinable &&
                                    <Invitation onClick={() => {
                                        setInvitationChannel(c);
                                        setInvitationOpen(true);
                                    }}/>
                                }
                            </TopicContainer>

                        )
                    })
                }
                <TopicButton onClick={() => setCreationOpen(true)}>Créer un topic</TopicButton>
            </PanelContainer>
            <ChatContainer>
                <Chat id='forum_chat'>
                    {
                        getSelectedChannel().messages.map(m => {
                            let color;
                            switch (m.type) {
                                case "button":
                                    color = '#01f4dc';
                                    break;
                                case "info":
                                    color = '#ffff81';
                                    break;
                                default:
                                    color = '#6890ab';
                                    break;
                            }
                            return (
                                <MessageContainer isRight={m.isMe}>
                                    <MessageBlock backgroundColor={color} clickable={m.type === 'button'} onClick={() => m.action && m.action(channels)}>
                                        <MessageTitle>{`${m.source.username} ${m.date.format('HH:mm:ss')}`}</MessageTitle>
                                        <MessageContent>{m.message}</MessageContent>
                                    </MessageBlock>
                                </MessageContainer>
                            )
                        })
                    }
                </Chat>
                <InputContainer>
                    <InputText
                        placeholder='Entrez un message'
                        onChange={(e) => setCurrentMessage(e.currentTarget.value)}
                        value={currentMessage}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.code === 'Enter') {
                                sendMessage(getSelectedChannel(), currentMessage);
                                setCurrentMessage('');
                            }
                        }}/>
                    <Sender
                        onClick={() => {
                            if (currentMessage.trim().length > 0) {
                                sendMessage(getSelectedChannel(), currentMessage);
                                setCurrentMessage('');
                            }
                        }}/>
                </InputContainer>
            </ChatContainer>
            <PanelContainer>
                {
                    channels.filter(c => c.type === 'user').map(c => {
                        return (
                            <TopicContainer>
                                <Notification
                                    isActive={c.messages.find(m => !m.isRead) !== undefined}>{c.messages.filter(m => !m.isRead).length}</Notification>
                                <Topic onClick={() => changeTopic(c)}
                                       selected={c.selected}>{c.source && c.source.username}</Topic>
                            </TopicContainer>
                        )
                    })
                }
            </PanelContainer>
        </Container>
    )
}

export default Main;