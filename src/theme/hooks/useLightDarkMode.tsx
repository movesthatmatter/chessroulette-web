import { useEffect, useState } from "react";

type DarkMode = {
  useDarkMode : boolean;
}

export const useLightDarkMode = () => {
  const [storedValue, setStoredValue] = useState<DarkMode>(() => {
    try { 
      const value = window.localStorage.getItem('useDarkMode');
      return value? JSON.parse(value) : {
        useDarkMode: false
      };
    }
    catch (e) {
      return {
        useDarkMode: false
      }
    }
  })
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('useDarkMode', JSON.stringify(storedValue))
    } catch (e) {
      setError(e);
    }
  },[storedValue])

  const setDarkMode = (value : boolean) => {
      setStoredValue({
        useDarkMode: value
      })
  }

  return {
    darkModeSetting: storedValue,
    setDarkMode,
    error
  }
}