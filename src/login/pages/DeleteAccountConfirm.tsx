import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import { CDIActions, CDIButton } from "../components/CDIButton";
import styles from "./DeleteAccountConfirm.module.css";

type DeleteAccountConfirmKcContext = Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>;
type DeleteAccountConfirmProps = Omit<PageProps<DeleteAccountConfirmKcContext, I18n>, "Template">;

export default function DeleteAccountConfirm(props: DeleteAccountConfirmProps) {
    const { kcContext, i18n } = props;

    const { url, triggered_from_aia } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={false} headerNode={msg("deleteAccountConfirm")}>
            <MessageAlert type="warning" summary={msgStr("irreversibleAction")} />

            <p>{msg("deletingImplies")}</p>

            <ul className={styles.list}>
                <li>{msg("loggingOutImmediately")}</li>
                <li>{msg("errasingData")}</li>
            </ul>

            <p>{msg("finalDeletionConfirmation")}</p>

            <form action={url.loginAction} method="post">
                <CDIActions>
                    <CDIButton type="submit" name="accept" value="true">
                        {msgStr("doConfirmDelete")}
                    </CDIButton>
                    {triggered_from_aia && (
                        <CDIButton secondary type="submit" name="cancel-aia" value="true" formNoValidate>
                            {msgStr("doCancel")}
                        </CDIButton>
                    )}
                </CDIActions>
            </form>
        </CdiTemplate>
    );
}
