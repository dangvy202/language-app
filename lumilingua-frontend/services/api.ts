export const fetchLevel = async ({ query }: { query: string }): Promise<Level[]> => {
    const endpoint = "http://127.0.0.1:8000/api/level/"

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    })

    if(!response.ok) {
        throw new Error('Fail to fetch level');
    }
    const data = await response.json();
    
    return data;
};