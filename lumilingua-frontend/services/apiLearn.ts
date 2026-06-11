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

export const getGoals = async (
    userCache: number,
    isCompleted: boolean
) => {
    
    const endpoint = getClientEndpoint(`goal/?user_cache=${userCache}&is_completed=${isCompleted}`);

    const response = await fetch(endpoint);

    return await response.json();
};

export const completeGoal = async (idGoal: number) => {
    
    const endpoint = getClientEndpoint(`goal/${idGoal}/complete/`);
    const response = await fetch(
        endpoint,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                is_completed: true,
            }),
        }
    );

    return await response.json();
};

export const getProgressReadingPremium = async (
    userCacheId: number
) => {
    const endpoint = getClientEndpoint(
        `exercise_progress_reading_premium/?user_cache=${userCacheId}`
    );

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(
            "Failed to fetch exercise progress reading"
        );
    }
    const data = await response.json();
    return data;
};


export const submitExerciseProgressReadingPremium = async ({
  id_user,
  id_reading_exercise,
  score,
  completed_at,
}: {
  id_user: number;
  id_reading_exercise: number;
  score: number;
  completed_at: string;
}) => {
  const endpoint = getClientEndpoint("exercise_progress_reading_premium/");

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_user, id_reading_exercise, score, completed_at }),
  });

  if (!response.ok) {
    throw new Error('Submit progress reading premium failed');
  }

  return response.json();
};

export const updateReadingGoal = async (userCacheId: number, xp_receive: number) => {
    try {
        const response = await fetch(
            getClientEndpoint(
                `goal/?user_cache=${userCacheId}&is_completed=false`
            )
        );
        const goals = await response.json();
        if (!goals.length) {
            return;
        }
        const goal = goals[0];
        const newActualReading = Number(goal.actual_reading || 0) + 1;
        
        console.log("check exp =", xp_receive)
        const update = await fetch(
            getClientEndpoint(`goal/${goal.id_goal}/`),
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    actual_reading: newActualReading,
                    actual_xp: xp_receive
                }),
            }
        );
        console.log("check update this = ", update)
    } catch (error) {
        console.log('Update reading goal failed:', error);
    }
};