const InviteForm = () => {
  return (
    <div className="flex flex-col justify-center gap-5 items-center min-h-10 w-40 border border-black py-10 ">
      <input
        type="text"
        className="border border-solid border-black rounded max-w-28 text-xs"
        placeholder="Enter email here..."
      />
      <button className="border border-solid rounded border-black p-1 text-blue-500 hover:text-blue-900 ">
        Send
      </button>
      <h1></h1>
    </div>
  );
};

export default InviteForm;
