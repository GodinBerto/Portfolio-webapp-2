"use client";
import Forms1 from "@/components/libraryComponent/forms/forms1";

export default function Login() {
  const handleSubmit = () => {
    console.log("Form submitted");
  };

  const data = [
    { type: "text", label: "First Name" },
    { type: "number", label: "Age" },
    { type: "date", label: "Date Of Birth" },
  ];

  return (
    <main>
      <Forms1
        heading="Dynamic Form"
        onClick={handleSubmit}
        numInput={3}
        width={30}
        labels={["FirstName", "Age", "Date Of Birth"]}
        inputTypes={["text", "number", "date"]}
      />
    </main>
  );
}
