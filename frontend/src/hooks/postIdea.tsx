import { useCallback } from 'react';

type ToolRequest = {
  criteria: string[];
  idea: {
    [key: string]: string | string[];
  } | null;
};

export const usePostToolRequest = () => {
  const postToolRequest = useCallback(async (payload: ToolRequest) => {
    if (payload.idea && payload.criteria.length){
    try {
      const response = await fetch('http://localhost:8000/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      return data;
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    }}
  }, []);

  return { postToolRequest };
};
