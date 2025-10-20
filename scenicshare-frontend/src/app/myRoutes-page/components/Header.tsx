export default function Header() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 text-left mt-24 sm:mt-28 lg:mt-32 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto lg:mx-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Your Routes{" "}
      </h1>

      <h5 className="my-3 sm:my-5 text-sm sm:text-base">
        Manage and track your shared scenic drives
      </h5>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full"></div>
    </div>
  );
}
