import { useState, useEffect } from "react";

const useTabVisibility = () => {
    
    const [isTabActive, setIsTabActive] = useState(!document.hidden);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return { isTabActive };
};

export default useTabVisibility;