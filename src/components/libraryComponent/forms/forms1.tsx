import Input from "./objects/input";

interface Forms1Props {
  heading: string;
  onClick: () => void;
  numInput: number;
  width: number;
  labels: string[];
  inputTypes: string[];
}

export default function Forms1({
  heading,
  onClick,
  numInput,
  width,
  inputTypes,
  labels,
}: Forms1Props) {
  const inputs = Array.from({ length: numInput }, (_, index) => (
    <Input
      key={index}
      label={labels[index] || `Input ${index + 1}`}
      inputType={inputTypes[index] || "text"}
      placeholder={""}
      value={""}
      id={""}
      name={""}
    />
  ));
  return (
    <div style={{ width: `${width}rem` }} className="transition-all duration-300 ease-in-out hover:shadow-lg rounded-lg p-6">
      <div className="space-y-4">
        <div className="bg-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold transition-all duration-300 ease-in-out">{heading}</h1>
          </div>
          {inputs}
          <div className="mt-6">
            <button 
              type="submit" 
              onClick={onClick}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 
              transition-all duration-300 ease-in-out transform hover:bg-indigo-700 
              hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-indigo-500 active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
