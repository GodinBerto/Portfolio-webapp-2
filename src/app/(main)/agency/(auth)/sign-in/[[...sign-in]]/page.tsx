import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          card: {
            backgroundColor: "#0d1117", // or any color you want
            color: "#fff", // text color
            border: "1px solid #fff", // border color
            borderRadius: "8px", // border radius
          },
        },
      }}
    />
  );
}
