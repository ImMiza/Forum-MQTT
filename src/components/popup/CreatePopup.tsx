import React from 'react';
import {Background, Button, Container, InputText, Title} from "./PopupStyle";

function CreatePopup(props: {
    onCancel: () => void,
    onCreate: (value: string) => void
}): JSX.Element {

    const [name, setName] = React.useState<string>('');

    function create(): void {
        if (name.trim().length > 0) {
            props.onCreate(name.trim());
        }
        setName('');
    }

    return (
        <>
            <Background/>
            <Container>
                <Title>Création de topic</Title>
                <InputText
                    placeholder='Nom du nouveau salon'
                    maxLength={10}
                    type='text'
                    onChange={(value: any) => setName(value.target.value)}
                    onKeyDown={(value) => {
                        if (value.key === 'Enter') {
                            create();
                        }
                    }}
                />
                <Button onClick={() => create()}>Créer un salon</Button>
                <Button onClick={() => props.onCancel()}>Annuler</Button>
            </Container>
        </>
    )
}

export default CreatePopup;