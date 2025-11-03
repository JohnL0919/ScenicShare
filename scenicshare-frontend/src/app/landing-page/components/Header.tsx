// import SearchBar from "./SearchBar";
import Button from "./Button";

export default function Header() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 text-left mt-24 sm:mt-28 lg:mt-32 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto lg:mx-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Discover Scenic{" "}
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        {" "}
        Driving Routes
      </h1>
      <h5 className="my-3 sm:my-5 text-sm sm:text-base">
        Explore breathtaking routes curated by fellow adventurers. Your next
        journey awaits.
      </h5>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
        {/* <div className="w-full sm:flex-1">
          <SearchBar />
        </div> */}
        <div className="w-full sm:w-32">
          <Button text="Discover" variant="primary" />
        </div>
      </div>
    </div>
  );
}
