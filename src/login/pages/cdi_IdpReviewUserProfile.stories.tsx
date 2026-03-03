import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "idp-review-user-profile.ftl" });

const meta = {
    title: "cdi/review-user-profile.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

import { realm, localeDE, localeEN, messagesPerField } from "./cdi_stories_shared";

function randomUsername(): string {
    return `user_${Math.random().toString(36).slice(2, 10)}`;
}

export const DefaultEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN
            }}
        />
    )
};

export const DefaultGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE
            }}
        />
    )
};

export const WithFormValidationErrorsEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: {
                    loginAction: "/mock-login-action"
                },
                messagesPerField: messagesPerField(["email"], "Invalid Email format."),
                isAppInitiatedAction: false
            }}
        />
    )
};

export const WithFormValidationErrorsGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                url: {
                    loginAction: "/mock-login-action"
                },
                messagesPerField: messagesPerField(["email"], "Ungültiges E-Mail-Format."),
                isAppInitiatedAction: false
            }}
        />
    )
};

export const WithReadOnlyFields: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: {
                    loginAction: "/mock-login-action"
                },
                isAppInitiatedAction: false,
                profile: {
                    attributesByName: {
                        email: { value: "jane.doe@example.com", readOnly: true },
                        firstName: { value: "Jane", readOnly: false }
                    }
                }
            }}
        />
    )
};

export const WithPrefilledFormFields: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: {
                    loginAction: "/mock-login-action"
                },
                isAppInitiatedAction: false,
                profile: {
                    attributesByName: {
                        firstName: { value: "Jane" },
                        lastName: { value: "Doe" },
                        email: { value: "jane.doe@example.com" }
                    }
                }
            }}
        />
    )
};

export const UsernameReadOnlyWithRandomPreFill: Story = {
    render: function UsernameReadOnlyWithRandomPreFillStory() {
        const [username] = useState(() => randomUsername());
        return (
            <KcPageStory
                kcContext={{
                    realm,
                    locale: localeEN,
                    url: {
                        loginAction: "/mock-login-action"
                    },
                    isAppInitiatedAction: false,
                    profile: {
                        attributesByName: {
                            username: {
                                readOnly: true,
                                value: username
                            }
                        }
                    }
                }}
            />
        );
    }
};
