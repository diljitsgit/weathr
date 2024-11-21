function Navbar() {
  return (
    <>
      <div className="block w-screen h-[50px] bg-background px-10 border-b-[1px] border-outline">
        <div className="flex justify-between items-center h-[50px]">
          <h1 className="text-white font-logo font-extrabold text-2xl">
            WEATHR
          </h1>
          <img
            src="/src/assets/github-mark-white.svg"
            alt="Github Icon"
            className="size-5"
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
