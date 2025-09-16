import Button from "./Button";
import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <div className="flex flex-row text-white p-5 justify-between items-center">
      <h1 className="text-2xl font-bold">ScenicShare</h1>
      <div></div>
      <Button text="Discover" />
      <Button text="My Routes" />
      <Button text="Favourites" />
      <SearchBar />
      <Button text="Share Route +" />
      <Button text="Profile" />
    </div>
  );
}
