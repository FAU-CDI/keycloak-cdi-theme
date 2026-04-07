import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";
import { CDIActions, CDIButton } from "../components/CDIButton";
import Collapsible from "../components/Collapsible";
import LogoutOtherSessionsCheckbox from "../components/LogoutOtherSessionsCheckbox";
import pageContent from "../components/PageContent.module.css";

export default function LoginRecoveryAuthnCodeConfig(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const olRecoveryCodesListId = "kc-recovery-codes-list";

    useScript({ olRecoveryCodesListId, i18n });

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("recovery-code-config-header")}>
            <Collapsible frozen defaultOpen={true} label={msgStr("cdiRecoveryCodes")}>
                <MessageAlert
                    type="warning"
                    summary={`${msgStr("recovery-code-config-warning-title")} ${msgStr("recovery-code-config-warning-message")}`}
                />
                <ol id={olRecoveryCodesListId} className={pageContent.recoveryCodesOrderedList}>
                    {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                        <BoxedListItem key={index}>
                            <span className={pageContent.recoveryCodeIndex}>{index + 1}.</span>{" "}
                            <span className={pageContent.recoveryCodeMono}>
                                {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                            </span>
                        </BoxedListItem>
                    ))}
                </ol>
            </Collapsible>

            {/* actions */}
            <CDIActions layout="rowWrap">
                <CDIButton id="printRecoveryCodes" type="button" secondary>
                    {msg("recovery-codes-print")}
                </CDIButton>
                <CDIButton id="downloadRecoveryCodes" type="button" secondary>
                    {msg("recovery-codes-download")}
                </CDIButton>
                <CDIButton id="copyRecoveryCodes" type="button" secondary>
                    {msg("recovery-codes-copy")}
                </CDIButton>
            </CDIActions>

            {/* confirmation checkbox */}
            <div className={pageContent.formBlockVertical}>
                <span className={pageContent.inlineCheckboxRow}>
                    <input
                        type="checkbox"
                        id="kcRecoveryCodesConfirmationCheck"
                        name="kcRecoveryCodesConfirmationCheck"
                        onChange={event => {
                            //@ts-expect-error: This is inherited from the original code
                            document.getElementById("saveRecoveryAuthnCodesBtn").disabled = !event.target.checked;
                        }}
                    />
                    <label htmlFor="kcRecoveryCodesConfirmationCheck">{msg("recovery-codes-confirmation-message")}</label>
                </span>
            </div>

            <form action={kcContext.url.loginAction} id="kc-recovery-codes-settings-form" method="post">
                <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />

                <LogoutOtherSessionsCheckbox i18n={i18n} wrapperId="kc-form-options" />

                {isAppInitiatedAction ? (
                    <CDIActions layout="rowWrap">
                        <CDIButton
                            as="input"
                            type="submit"
                            id="saveRecoveryAuthnCodesBtn"
                            value={msgStr("recovery-codes-action-complete")}
                            disabled
                        />
                        <CDIButton id="cancelRecoveryAuthnCodesBtn" name="cancel-aia" value="true" type="submit" secondary>
                            {msg("recovery-codes-action-cancel")}
                        </CDIButton>
                    </CDIActions>
                ) : (
                    <CDIActions>
                        <CDIButton
                            as="input"
                            type="submit"
                            id="saveRecoveryAuthnCodesBtn"
                            value={msgStr("recovery-codes-action-complete")}
                            disabled
                        />
                    </CDIActions>
                )}
            </form>
        </CdiTemplate>
    );
}
