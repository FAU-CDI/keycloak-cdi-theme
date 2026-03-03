import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-profile.ftl" });

const meta = {
    title: "login/login-update-profile.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

import { realm, localeDE, localeEN, messagesPerField } from "./_stories_shared";

const profile = {
    attributesByName: {
        username: {
            readOnly: true,
            value: "whatever"
        }
    }
};

export const DefaultEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                profile,
                isAppInitiatedAction: true
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
                profile,
                isAppInitiatedAction: true
            }}
        />
    )
};

export const WithProfileErrorEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                url: {
                    loginAction: "/mock-login-action"
                },
                messagesPerField: messagesPerField(["email"], "Invalid Email format."),
                isAppInitiatedAction: true,
                profile
            }}
        />
    )
};

export const WithProfileErrorGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                url: {
                    loginAction: "/mock-login-action"
                },
                messagesPerField: messagesPerField(["email"], "Ungültiges Email format."),
                isAppInitiatedAction: true
            }}
        />
    )
};
