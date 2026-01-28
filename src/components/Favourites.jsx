import { useFavourite } from "../context/FavouriteContext";
import { AiFillHeart } from "react-icons/ai";

export default function Favourites({ allItems }) {
  const { favourites, toggleFavourite } = useFavourite();

  const favItems = allItems.filter((item) =>
    favourites.includes(item.id)
  );

  if (favItems.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No favourites yet ❤️</h2>;
  }

  return (
    <div className="menu-flex">
      {favItems.map((item) => (
        <div className="menu-card" key={item.id}>
          <div className="menu-img">
            <img src={item.img} alt={item.title} />
            <span
              className="fav-icon active"
              onClick={() => toggleFavourite(item.id)}
            >
              <AiFillHeart />
            </span>
          </div>

          <div className="menu-content">
            <h3>{item.title}</h3>
            <span className="price">${item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
