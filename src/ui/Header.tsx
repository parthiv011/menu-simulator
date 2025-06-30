import { Link } from "react-router-dom";
import { SearchOrder } from "../features/order/SearchOrder";

export const Header = () => {
  return (
    <header>
      <Link to={"/"}>Pizza Company Co.</Link>
      <SearchOrder />
    </header>
  );
};
