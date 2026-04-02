import { Fragment } from "react";
import BoxedListItem from "./BoxedListItem";

export type OtpCredentialItem = { id: string; userLabel: string };

type OtpCredentialRadioListProps = {
    credentials: OtpCredentialItem[];
    selectedCredentialId: string | undefined;
    idPrefix: string;
};

const listStyle = {
    margin: 0,
    padding: 0,
    listStyle: "none" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem"
};

const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: 0,
    fontWeight: 500,
    cursor: "pointer"
};

export default function OtpCredentialRadioList(props: OtpCredentialRadioListProps) {
    const { credentials, selectedCredentialId, idPrefix } = props;

    return (
        <ul style={listStyle}>
            {credentials.map((otpCredential, index) => {
                const inputId = `${idPrefix}-${index}`;
                return (
                    <Fragment key={otpCredential.id}>
                        <BoxedListItem>
                            <label htmlFor={inputId} style={labelStyle}>
                                <input
                                    id={inputId}
                                    type="radio"
                                    name="selectedCredentialId"
                                    value={otpCredential.id}
                                    defaultChecked={
                                        otpCredential.id === selectedCredentialId
                                    }
                                />
                                <span>{otpCredential.userLabel}</span>
                            </label>
                        </BoxedListItem>
                    </Fragment>
                );
            })}
        </ul>
    );
}
