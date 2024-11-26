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
    <div style={{ width: `${width}rem` }}>
      <div>
        <div>
          <div>
            <h1>{heading}</h1>
          </div>
          {inputs}
          <div>
            <button type="submit" onClick={onClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
