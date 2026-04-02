import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { useState } from "react";
import type { I18n } from "../i18n";
import { CDIActions, CDIButton } from "./CDIButton";

import styles from "./CdiUserProfileForm.module.css";
import CdiUserProfileFormFields from "./CdiUserProfileFormFields";

type KcContextWithProfile = {
    profile: unknown;
    url: { loginAction: string };
    messagesPerField?: unknown;
    isAppInitiatedAction?: boolean;
};

export type CdiUserProfileFormProps = {
    formRef?: ComponentPropsWithRef<"form">["ref"];
    /** e.g. Keycloak `kc-update-email-form` for automation / compatibility */
    formId?: string;
    action: string;
    isAppInitiatedAction?: boolean;
    i18n: I18n;
    doMakeUserConfirmPassword: boolean;
    kcContext: KcContextWithProfile;
    introNode?: ReactNode;
    extraNode?: ReactNode;
    footerNode?: ReactNode;
    isSubmitDisabled?: boolean;
    renderPrimaryButton?: (opts: { disabled: boolean; label: string }) => ReactElement;
    submitLabel?: string;
};

export default function CdiUserProfileForm(props: CdiUserProfileFormProps) {
    const {
        formRef,
        formId,
        action,
        isAppInitiatedAction,
        i18n,
        doMakeUserConfirmPassword,
        kcContext,
        introNode,
        extraNode,
        footerNode,
        isSubmitDisabled,
        renderPrimaryButton,
        submitLabel
    } = props;

    const { msg, msgStr } = i18n;
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    const resolvedSubmitLabel = submitLabel ?? msgStr("doSubmit");
    const disabled = !isFormSubmittable || !!isSubmitDisabled;

    return (
        <form
            ref={formRef}
            id={formId}
            className={styles.form}
            action={action}
            method="post"
        >
            <CdiUserProfileFormFields
                kcContext={kcContext}
                i18n={i18n}
                onIsFormSubmittableValueChange={setIsFormSubmittable}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
            />
            {introNode !== undefined ? (
                <p className={styles.formIntro}>{introNode}</p>
            ) : null}
            {extraNode}
            {footerNode}
            <CDIActions layout="rowWrap">
                {renderPrimaryButton !== undefined ? (
                    renderPrimaryButton({ disabled, label: resolvedSubmitLabel })
                ) : (
                    <CDIButton
                        as="input"
                        disabled={disabled}
                        type="submit"
                        value={resolvedSubmitLabel}
                    />
                )}
                {isAppInitiatedAction && (
                    <CDIButton
                        secondary
                        type="submit"
                        name="cancel-aia"
                        value="true"
                        formNoValidate
                    >
                        {msg("doCancel")}
                    </CDIButton>
                )}
            </CDIActions>
        </form>
    );
}
