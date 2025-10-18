import { useEffect, useState } from "react";
import API from "../api";

export default function CartBadge() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        API.get("/cart")
            .then(res => setCount(res.data.items.length))
            .catch(() => {});
    }, []);
    return (
        <span style={{marginLeft: 4, color: "red"}}>
      {count > 0 ? `(${count})` : ""}
    </span>
    );
}
