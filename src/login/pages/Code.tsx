import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import styles from "./Code.module.css";

type CodeKcContext = Extract<KcContext, { pageId: "code.ftl" }>;
type CodeProps = Omit<PageProps<CodeKcContext, I18n>, "Template">;

export default function Code(props: CodeProps) {
    const { kcContext, i18n } = props;

    const { code } = kcContext;

    const { msg } = i18n;

    const headerNode = code.success
        ? msg("codeSuccessTitle")
        : msg("codeErrorTitle", code.error);

    return (
        <CdiTemplate
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={false}
            headerNode={headerNode}
        >
            {code.success ? (
                <>
                    <p>{msg("copyCodeInstruction")}</p>
                    <input className={styles.codeInput} readOnly value={code.code ?? ""} />
                </>
            ) : (
                code.error && <MessageAlert type="error" summary={code.error} />
            )}
        </CdiTemplate>
    );
}
