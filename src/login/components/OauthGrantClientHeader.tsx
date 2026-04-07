import type { ReactNode } from "react";
import pageContent from "./PageContent.module.css";

export type OauthGrantClientHeaderProps = {
    logoUri?: string;
    children: ReactNode;
};

export default function OauthGrantClientHeader(props: OauthGrantClientHeaderProps) {
    const { logoUri, children } = props;

    return (
        <div className={pageContent.oauthClientHeader}>
            {logoUri ? (
                <img src={logoUri} alt="" className={pageContent.oauthClientLogo} />
            ) : null}
            <p className={pageContent.oauthClientIntro}>{children}</p>
        </div>
    );
}
