import React from 'react';
import Main from "./pages/main/Main";
import './App.css';
import Connexion from "./pages/connexion/Connexion";
import mqtt from "mqtt";

function App() {
    const [connected, setConnected] = React.useState<boolean>(false);

    const [client, setClient] = React.useState<mqtt.MqttClient>();

    if(connected) {
        return <Main client={client} />
    } else {
        return <Connexion onConnect={(client) => {
            setClient(client);
            setConnected(true);
        }}/>
    }
}

export default App;
