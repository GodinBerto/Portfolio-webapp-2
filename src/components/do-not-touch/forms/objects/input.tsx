interface InputProps {
  label: string;
  inputType: string;
  placeholder: string;
  value: string;
  id: string;
  name: string;
}

export default function Input({
  label,
  inputType,
  placeholder,
  id,
  name,
  value,
}: InputProps) {
  const inputValue = value === label ? "" : value;
  const inputName = name === "name" ? "" : name;
  const inputId = id === "id" ? "" : id;
  if (inputType === "text") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
          value={inputValue}
          name={inputName}
          id={inputId}
        />
      </div>
    );
  } else if (inputType === "number") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="number"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 sm:text-sm"
        />
      </div>
    );
  } else if (inputType === "date") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 sm:text-sm"
        />
      </div>
    );
  }
}
