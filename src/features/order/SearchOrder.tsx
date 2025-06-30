import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const SearchOrder = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Seach Order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};
