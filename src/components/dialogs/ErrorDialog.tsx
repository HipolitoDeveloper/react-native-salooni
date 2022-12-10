import React from "react";
import Dialog from "@components/dialogs/Dialog";
import {CircleIcon, HStack, Text} from "native-base";
import {application} from "@common/typograph";

interface IErrorDialog {
    messages: string[];
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;

}

const ErrorDialog: React.FC<IErrorDialog> = ({messages, isOpen, onClose, onOpen}) => {

    return (
        <Dialog isOpen={isOpen} onClose={onClose} buttons={[]} title={application.ATTENTION}>
            {messages?.length && messages?.map(message => (
                <HStack alignItems='center' space='10px'>
                    <CircleIcon size='10px' color='purple.1000'/>
                    <Text>
                        {message}
                    </Text>
                </HStack>
            ))}
        </Dialog>
    )

}

export default ErrorDialog