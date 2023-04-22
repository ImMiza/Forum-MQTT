import React from 'react';
import {
    Button,
    Container, ContainerLoading,
    ErrorMessage,
    InputContainer,
    InputText,
    MainContainer, TextLoading,
    Title
} from "./ConnexionStyle";
import {Loader, LoaderState} from "../../utils/loader";
import {userLogin, userRegister} from "../../datas/Auth";
import mqtt from "mqtt";
import uuid from "react-uuid";
import {MQTT_HOST, MQTT_PORT, MQTT_PROTOCOL} from "../../utils/keys";

function Connexion(props: {
    onConnect: (client: mqtt.MqttClient) => void
}): JSX.Element {

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const [loading, setLoading] = React.useState<LoaderState>(LoaderState.LOADED);
    const [loadingMessage, setLoadingMessage] = React.useState<string>('');

    const [error, setError] = React.useState<string>('test');

    const [isRegister, setRegister] = React.useState<boolean>(false);

    function connectMqtt(): void {
        setLoadingMessage('Connexion au broker MQTT en cours...');

        const client: mqtt.MqttClient = mqtt.connect(`${MQTT_PROTOCOL}://${MQTT_HOST}`, {clientId: uuid(), username, port: MQTT_PORT});
        client.on('connect', () => {
            props.onConnect(client);
        });

        client.on('error', () => {
            setLoadingMessage('Erreur connexion au broker MQTT');
        });

        client.on('reconnect', () => {
            setLoadingMessage('Nouvelle connexion au broker MQTT en cours...');
        });
    }

    function connect(): void {
        if (username.trim().length > 0 && password.trim().length > 0) {
            setLoading(LoaderState.LOADING);
            if (isRegister) {
                setLoadingMessage('Enregistrement en cours...');
                userRegister({username, password})
                    .then(result => {
                        if (result.success) {
                            connectMqtt();
                        } else {
                            setError(result.reason);
                            setLoading(LoaderState.ERROR);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        setLoading(LoaderState.ERROR);
                    });
            } else {
                setLoadingMessage('Connexion en cours...');
                userLogin({username, password})
                    .then(result => {
                        if (result.success) {
                            connectMqtt();
                        } else {
                            setError(result.reason);
                            setLoading(LoaderState.ERROR);
                        }
                    })
                    .catch(error => {
                        setLoading(LoaderState.ERROR);
                        setError(error.reason);
                    });
            }
        } else {
            setLoading(LoaderState.ERROR);
            setError('Entrez un username/mot de passe');
        }
    }

    if (loading === LoaderState.LOADING) {
        return (
            <ContainerLoading>
                <Loader size={150}/>
                <TextLoading>{loadingMessage}</TextLoading>
            </ContainerLoading>
        )
    }

    return (
        <Container>
            <MainContainer>
                <Title>{isRegister ? 'Inscrivez vous !' : 'Connectez vous !'}</Title>
                <InputContainer>
                    <InputText
                        placeholder='Username'
                        maxLength={25}
                        onChange={(value: any) => setUsername(value.target.value)}
                        onKeyDown={(value) => {
                            if (value.key === 'Enter') {
                                connect();
                            }
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputText
                        placeholder='Mot de passe'
                        maxLength={25}
                        type='password'
                        onChange={(value: any) => setPassword(value.target.value)}
                        onKeyDown={(value) => {
                            if (value.key === 'Enter') {
                                connect();
                            }
                        }}
                    />
                </InputContainer>
                <Button onClick={() => connect()}>{isRegister ? 'S\'inscrire' : 'Se connecter'}</Button>
                <Button
                    onClick={() => setRegister(!isRegister)}>{isRegister ? 'Tu veux te connecter ? clique ici' : 'Tu veux t\'inscrire ? clique ici'}</Button>
                {
                    loading === LoaderState.ERROR &&
                    <ErrorMessage>{error}</ErrorMessage>
                }
            </MainContainer>
        </Container>

    )
}

export default Connexion;