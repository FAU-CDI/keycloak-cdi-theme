import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";
import { CDIActions, CDIButton } from "../components/CDIButton";
import Collapsible from "../components/Collapsible";

export default function LoginRecoveryAuthnCodeConfig(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const olRecoveryCodesListId = "kc-recovery-codes-list";

    useScript({ olRecoveryCodesListId, i18n });

    const showMessage = kcContext.message !== undefined;
    const messageNode = showMessage && kcContext.message ? <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} /> : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("recovery-code-config-header")}>
            {messageNode}

            <Collapsible frozen defaultOpen={true} label={msgStr("cdiRecoveryCodes")}>
                <MessageAlert
                    type="warning"
                    summary={`${msgStr("recovery-code-config-warning-title")} ${msgStr("recovery-code-config-warning-message")}`}
                />
                <ol
                    id={olRecoveryCodesListId}
                    style={{
                        margin: "1rem 0",
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem"
                    }}
                >
                    {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                        <BoxedListItem key={index}>
                            <span style={{ fontWeight: 600 }}>{index + 1}.</span>{" "}
                            <span
                                style={{
                                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                                }}
                            >
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
            <div style={{ margin: "1rem 0" }}>
                <input
                    type="checkbox"
                    id="kcRecoveryCodesConfirmationCheck"
                    name="kcRecoveryCodesConfirmationCheck"
                    onChange={event => {
                        //@ts-expect-error: This is inherited from the original code
                        document.getElementById("saveRecoveryAuthnCodesBtn").disabled = !event.target.checked;
                    }}
                />
                <label htmlFor="kcRecoveryCodesConfirmationCheck" style={{ marginLeft: "0.5rem" }}>
                    {msg("recovery-codes-confirmation-message")}
                </label>
            </div>

            <form action={kcContext.url.loginAction} id="kc-recovery-codes-settings-form" method="post">
                <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />

                <LogoutOtherSessions i18n={i18n} />

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

function LogoutOtherSessions(props: { i18n: I18n }) {
    const { i18n } = props;
    const { msg } = i18n;

    return (
        <div id="kc-form-options" style={{ margin: "1rem 0" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                <span>{msg("logoutOtherSessions")}</span>
            </label>
        </div>
    );
}
