export const ButtonString1 = `
import React, { ReactNode } from "react";

export default function Button1({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <button
      className='py-2 px-6 text-white rounded-md border-2 h-10 flex items-center justify-center transition-transform transform hover:scale-110'
    >
      {children}
    </button>
  );
}
`;

export const ButtonString2 = `
import React, { ReactNode } from "react";

export default function Button2({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <button
      className='py-2 px-6 text-white rounded-md border-2 h-10 flex items-center justify-center transition-transform transform hover:scale-110'
    >
      {children}
    </button>
  );
}
`;
