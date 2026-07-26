import { useEffect, useState } from "react";

function useQuotations() {

    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    return {

        quotations,
        setQuotations,
        loading,
        setLoading,

    };

}

export default useQuotations;