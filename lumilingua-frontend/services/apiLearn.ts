import { getClientEndpoint } from "@/constants/configApi";

export const saveGoals = async ({
    description,
    goal_reading,
    goal_listening,
    goal_writing,
    goal_speaking,
    goal_xp,
    user_cache
}: {
    description: string;
    goal_reading: number;
    goal_listening: number;
    goal_writing: number;
    goal_speaking: number;
    goal_xp: number;
    user_cache: number;
}) => {
    const payload: Record<string, any> = {
        description,
        goal_reading,
        goal_listening,
        goal_writing,
        goal_speaking,
        goal_xp,
        user_cache
    };

    const endpoint = getClientEndpoint("goal/");

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return await response.json();
};