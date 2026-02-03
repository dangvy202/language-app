import { useState, useCallback, useEffect } from "react";

type FetchFn<T> = () => Promise<T>;

const useFetch = <T>(fetchFn: FetchFn<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;