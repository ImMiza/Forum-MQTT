import React from 'react';
import {
    Background,
    Button,
    Container,
    InputSelect,
    InputText,
    Name,
    SelectBox,
    SelectContainer,
    Title
} from "./PopupStyle";
import {Channel, User} from "../../interfaces/main";

interface Selection {
    user: User
    selected: boolean
}

function InvitationPopup(props: {
    channel: Channel,
    users: User[],
    onCancel: () => void,
    onConfirm: (users: User[]) => void
}): JSX.Element {

    const [selections, setSelections] = React.useState<Selection[]>([]);

    React.useEffect(() => {
        setSelections(props.users.map(u => ({user: u, selected: false})));
    }, [JSON.stringify(props.users)]);

    function confirm(): void {
        props.onConfirm(selections.filter(s => s.selected).map(s => s.user));
    }

    return (
        <>
            <Background/>
            <Container>
                <Title>Invitation pour le topic</Title>
                <SelectContainer>
                    {
                        selections.map(s => {
                            return (
                                <SelectBox>
                                    <InputSelect
                                        type='checkbox'
                                        checked={s.selected}
                                        onClick={() => setSelections(selections.map(s2 => s2.user.id === s.user.id ? {
                                            ...s,
                                            selected: !s.selected
                                        } : s2))}
                                    />
                                    <Name>{s.user.username}</Name>
                                </SelectBox>
                            )
                        })
                    }
                </SelectContainer>
                <Button onClick={() => confirm()}>Inviter</Button>
                <Button onClick={() => props.onCancel()}>Annuler</Button>
            </Container>
        </>
    )
}

export default InvitationPopup;