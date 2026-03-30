import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import styles from "./DeleteCredential.module.css";

type DeleteCredentialKcContext = Extract<KcContext, { pageId: "delete-credential.ftl" }>;

export default function DeleteCredential(props: PageProps<DeleteCredentialKcContext, I18n>) {
    const { kcContext, i18n } = props;

    const { msgStr, msg } = i18n;

    const { url, credentialLabel } = kcContext;

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            headerNode={msg("deleteCredentialTitle", credentialLabel)}
        >
            <p>{msg("deleteCredentialMessage", credentialLabel)}</p>

            <form action={url.loginAction} method="post">
                <div className={styles.actions}>
                    <button name="accept" type="submit" data-action-button>
                        {msgStr("doConfirmDelete")}
                    </button>
                    <button name="cancel-aia" type="submit" data-second-button>
                        {msgStr("doCancel")}
                    </button>
                </div>
            </form>
        </CdiTemplate>
    );
}
