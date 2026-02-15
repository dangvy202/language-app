import { useEffect, useState, useCallback } from "react";
import { fetchUserNotes } from "@/services/api";

export interface UserNote {
    id: number;
    vocabulary: number;
    user_cache_id: number;
    content_note?: string;
    description_note?: string;
}

export function useSavedVocabulary(userCacheId?: number) {
    const [savedSet, setSavedSet] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSaved = useCallback(async () => {
        if (!userCacheId) return;

        try {
            setLoading(true);
            setError(null);

            const data: UserNote[] = await fetchUserNotes(userCacheId);

            const newSet = new Set<number>(
                data.map(item => Number(item.vocabulary))
            );

            setSavedSet(newSet);
        } catch (err: any) {
            setError(err.message || "Failed to load saved vocabulary");
        } finally {
            setLoading(false);
        }
    }, [userCacheId]);

    useEffect(() => {
        loadSaved();
    }, [loadSaved]);

    const isSavedVocabulary = useCallback(
        (id: number) => savedSet.has(id),
        [savedSet]
    );

    const add = useCallback((id: number) => {
        setSavedSet(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }, []);

    const remove = useCallback((id: number) => {
        setSavedSet(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, []);

    return {
        savedSet,
        isSavedVocabulary,
        add,
        remove,
        reload: loadSaved,
        loading,
        error,
    };
}
