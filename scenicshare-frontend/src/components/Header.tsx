import SearchBar from "./SearchBar";
import Button from "./Button";

export default function Header() {
  return (
    <div className="mx-20 px-5 sm:px-6 lg:px-8 text-left mt-20 w-[40%]">
      <h1 className="text-6xl">Discover Scenic </h1>
      <h1 className="text-6xl"> Driving Routes</h1>
      <h5 className="my-5">
        Explore breathtaking routes curated by fellow adventurers. Your next
        journey awaits.
      </h5>
      <div className="flex flex-row gap-3">
        {" "}
        <SearchBar />
        <Button text="Discover" />
      </div>
    </div>
  );
}
