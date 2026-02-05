// hooks/useUserCache.ts
import { fetchUserCache } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useUserCache() {
    const [cache, setCache] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const em = await AsyncStorage.getItem("email");
            if (em) setEmail(em);
        })();
    }, []);

    useEffect(() => {
        if (!email) {
            setLoading(false);
            return;
        }

        let mounted = true;
        setLoading(true);
        setError(null);

        fetchUserCache({ email })
            .then(data => {
                if (mounted) setCache(data);
            })
            .catch(err => {
                if (mounted) setError(err.message);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, [email]);

    return { cache, loadingCache: loading, cacheError: error, email };
}