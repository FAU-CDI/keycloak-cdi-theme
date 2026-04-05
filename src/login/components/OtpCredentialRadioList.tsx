import { Fragment } from "react";
import BoxedListItem from "./BoxedListItem";

import styles from "./OtpCredentialRadioList.module.css";

export type OtpCredentialItem = { id: string; userLabel: string };

type OtpCredentialRadioListProps = {
    credentials: OtpCredentialItem[];
    selectedCredentialId: string | undefined;
    idPrefix: string;
};

export default function OtpCredentialRadioList(props: OtpCredentialRadioListProps) {
    const { credentials, selectedCredentialId, idPrefix } = props;

    return (
        <ul className={styles.list}>
            {credentials.map((otpCredential, index) => {
                const inputId = `${idPrefix}-${index}`;
                return (
                    <Fragment key={otpCredential.id}>
                        <BoxedListItem>
                            <label htmlFor={inputId} className={styles.radioLabel}>
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
