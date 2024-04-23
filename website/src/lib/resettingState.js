import { useState, useEffect } from 'react';

// https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation

export function useResettingState(prop) {
  const [state, setState] = useState(prop);

  useEffect(() => {
    setState(prop);
  }, [prop]);

  return [state, setState];
}
