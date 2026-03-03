import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { I18n } from "../i18n";

import styles from "./CdiUserProfileForm.module.css";
import { KcClsx } from "keycloakify/login/lib/kcClsx";

type KcContextWithProfile = {
    profile: unknown;
    url: { loginAction: string };
    messagesPerField?: unknown;
    isAppInitiatedAction?: boolean;
};

export type CdiUserProfileFormProps = {
    url: { loginAction: string };
    isAppInitiatedAction?: boolean;
    i18n: I18n;
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
    kcContext: KcContextWithProfile;
};

const fakeKcClsx: KcClsx = () => "";

export default function CdiUserProfileForm(props: CdiUserProfileFormProps) {
    const {
        url,
        isAppInitiatedAction,
        i18n,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
        kcContext
    } = props;

    const { msg, msgStr } = i18n;
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <form className={styles.form} action={url.loginAction} method="post">
            <UserProfileFormFields
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={fakeKcClsx}
                onIsFormSubmittableValueChange={setIsFormSubmittable}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
            />
            <p className={styles.formIntro}>{msg("cdiUpdateProfileIntro")}</p>
            <div className={styles.formActions}>
                <input
                    disabled={!isFormSubmittable}
                    type="submit"
                    value={msgStr("doSubmit")}
                    data-action-button
                />
                {isAppInitiatedAction && (
                    <button
                        type="submit"
                        name="cancel-aia"
                        value="true"
                        formNoValidate
                        data-second-button
                    >
                        {msg("doCancel")}
                    </button>
                )}
            </div>
        </form>
    );
}
