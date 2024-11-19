import { useState, useEffect } from "react";

export default function useDebounce(value, delay = 250) {
    const [debounce, setDebounce] = useState(value)

    useEffect(() => {
        const id = setTimeout(() => setDebounce(value), delay)

        return () => clearTimeout(id)
    }, [value, delay])

    return debounce
}