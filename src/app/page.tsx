"use client";

import Rain from "../components/animations/rain";
import WaterEdgeAnimation from "../components/animations/waterEdgeAnimation";
import Button1 from "@/components/libraryComponent/buttons/button1";
import { useTheme } from "./themes/themeContext/themeContext";
import Button2 from "@/components/libraryComponent/buttons/button2";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import PrismLoader from "../components/pageComponents/prismLoader";
import { ButtonString1 } from "../constants/compoonentString";
import { ButtonString2 } from "../constants/compoonentString";
import Card, { RatingCard } from "@/components/do-not-touch/cards";

export default function Home() {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState("");
  const [codeString, setCodeString] = useState(ButtonString1);

  const themeClasses: {
    [key: string]: {
      button1: string;
      text: string;
      button2: string;
      buttonHover: string;
    };
  } = {
    red: {
      button1: "bg-red-600 border-red-600",
      text: "text-red-600",
      button2: "border-red-600 text-red-600",
      buttonHover: "hover:bg-red-600",
    },
    yellow: {
      button1: "bg-yellow-500 border-yellow-s00",
      button2: "border-yellow-500 text-yellow-500",
      text: "text-yellow-500",
      buttonHover: "hover:bg-yellow-500",
    },
    blue: {
      button1: "bg-blue-500 border-blue-500",
      button2: "border-blue-500 text-blue-500",
      text: "text-blue-500",
      buttonHover: "hover:bg-blue-500",
    },
    green: {
      button1: "bg-green-600 border-green-600",
      button2: "border-green-600 text-green-600",
      text: "text-green-600",
      buttonHover: "hover:bg-green-600",
    },
  };

  // Ensure to default to blue theme if theme is not valid or undefined
  const currentTheme = themeClasses[theme] || themeClasses["blue"];
  console.log("Current Theme:", theme);

  console.log("text from me: ", currentTheme.text);

  const ButtonClicked = (button: string) => {
    setActiveButton(button);
    if (button === "Button1") {
      setCodeString(ButtonString1);
    } else if (button === "Button2") {
      setCodeString(ButtonString2);
    } else {
      setCodeString("no components found");
    }
  };

  return (
    <div className="p-10 flex gap-4">
      <Card img={"/themes/mainTheme.png"} />
      <RatingCard
        imgSrc="/themes/mainTheme.png" // Path to profile image
        name="Regina Miles"
        title="Designer"
        description="Slate helps you see how many more days you need to work to reach your financial goal for the month and year."
        rating={2} // User-selected rating (change as needed)
      />
    </div>
  );
}
