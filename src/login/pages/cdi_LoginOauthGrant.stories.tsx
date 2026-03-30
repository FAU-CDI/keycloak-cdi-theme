import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import { localeDE, localeEN, realm } from "./cdi_stories_shared";

const { KcPageStory } = createKcPageStory({ pageId: "login-oauth-grant.ftl" });

const meta = {
    title: "cdi/login-oauth-grant",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: { oauthAction: "/oauth-action" },
                oauth: {
                    clientScopesRequested: [{ consentScreenText: "Scope1", dynamicScopeParameter: "dynamicScope1" }, { consentScreenText: "Scope2" }],
                    code: "mockCode"
                },
                client: {
                    attributes: {
                        logoUri: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
                        policyUri: "https://twitter.com/en/tos",
                        tosUri: "https://twitter.com/en/privacy"
                    },
                    name: "Twitter",
                    clientId: "twitter-client-id"
                }
            }}
        />
    )
};

export const DefaultGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                url: { oauthAction: "/oauth-action" },
                oauth: {
                    clientScopesRequested: [{ consentScreenText: "Scope1", dynamicScopeParameter: "dynamicScope1" }, { consentScreenText: "Scope2" }],
                    code: "mockCode"
                },
                client: {
                    attributes: {
                        logoUri: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
                        policyUri: "https://twitter.com/en/tos",
                        tosUri: "https://twitter.com/en/privacy"
                    },
                    name: "Twitter",
                    clientId: "twitter-client-id"
                }
            }}
        />
    )
};
