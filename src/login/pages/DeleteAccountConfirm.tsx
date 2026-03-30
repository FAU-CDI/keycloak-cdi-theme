import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import styles from "./DeleteAccountConfirm.module.css";

type DeleteAccountConfirmKcContext = Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>;
type DeleteAccountConfirmProps = Omit<PageProps<DeleteAccountConfirmKcContext, I18n>, "Template">;

export default function DeleteAccountConfirm(props: DeleteAccountConfirmProps) {
    const { kcContext, i18n } = props;

    const { url, triggered_from_aia } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            headerNode={msg("deleteAccountConfirm")}
        >
            <MessageAlert type="warning" summary={msgStr("irreversibleAction")} />

            <p>{msg("deletingImplies")}</p>

            <ul className={styles.list}>
                <li>{msg("loggingOutImmediately")}</li>
                <li>{msg("errasingData")}</li>
            </ul>

            <p>{msg("finalDeletionConfirmation")}</p>

            <form action={url.loginAction} method="post">
                <div className={styles.actions}>
                    <button type="submit" name="accept" value="true" data-action-button>
                        {msgStr("doConfirmDelete")}
                    </button>
                    {triggered_from_aia && (
                        <button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            formNoValidate
                            data-second-button
                        >
                            {msgStr("doCancel")}
                        </button>
                    )}
                </div>
            </form>
        </CdiTemplate>
    );
}
