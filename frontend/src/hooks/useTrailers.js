import { useEffect, useState } from "react";

import { getTrailers } from "../services/trailerService";

function useTrailers() {

    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshTrailers = async () => {

        setLoading(true);

        try {

            const data = await getTrailers();

            setTrailers(data);

        } catch (error) {

            console.error(error);

        }

        setLoading(false);

    };

    useEffect(() => {

        refreshTrailers();

    }, []);

    return {
        trailers,
        loading,
        refreshTrailers,
    };

}

export default useTrailers;