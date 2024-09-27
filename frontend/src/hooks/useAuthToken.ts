import { useEffect, useState } from "react";

const useAuthToken = () => {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/validate_token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    setIsValid(true);
                } else {
                    localStorage.removeItem('token');   // Invalid token
                    setIsValid(false);
                }
            })
            .catch(() => setIsValid(false));
        }
    }, []);

    return isValid;
};

export default useAuthToken;