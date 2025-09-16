import { useTheme } from "@/context/themeContext";
import { themeClasses } from "@/constants/themes";
import {
  CardsTypes1,
  CardsTypesWithBordersAndIcon,
  RatingCardProps,
} from "@/types/cards";
import Image from "next/image";
import Link from "next/link";

export function Card({
  img = "/images/cards/profile.jpg",
  title = "Title",
  text = "Card text goes here",
  buttonText = "Read More",
  link = "#",
}: CardsTypes1) {
  const { theme } = useTheme();

  // Determine the current class string
  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]"; // Default to blue if theme not found
  return (
    <div
      className={`bg-white dark:bg-semiblack dark:border-gray-800 hover:dark:border-gray-700 border-[1px] rounded-2xl shadow-lg overflow-hidden w-80 h-[370px]`}
    >
      <div className="p-4 flex flex-col items-center justify-center h-full gap-3">
        <Image src={`${img}`} alt={"card image"} width={150} height={150} />
        <div className="p-4 flex flex-col items-center justify-center gap-3">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-500 text-center text-sm">
            {text}
          </p>
          <Link href={`${link}`}>
            <button
              className={` px-4 py-2 bg-${currentThemeClass}-500 border-${currentThemeClass}-500 hover:bg-${currentThemeClass}-600 hover:border-${currentThemeClass}-600 text-white rounded-lg transition`}
            >
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

//Ratings Card Components
export function RatingCard({
  imgSrc,
  name,
  title,
  description,
  rating,
}: RatingCardProps) {
  const { theme } = useTheme();

  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]";
  return (
    <div className="bg-white dark:bg-semiblack dark:border-gray-800 hover:dark:border-gray-700 border-[1px] rounded-2xl shadow-lg overflow-hidden w-80 h-[370px] flex justify-center items-center flex-col">
      {/* Profile Image */}
      <div className="flex justify-center">
        <Image
          src={imgSrc}
          alt={name}
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {/* Description Text */}
      <p className="text-gray-600 dark:text-gray-500 text-sm mt-4 px-2 text-center">
        {description}
      </p>

      {/* Star Rating */}
      <div className="flex justify-center my-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`text-xl ${
              num <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Name and Job Title */}
      <h3 className={`text-${currentThemeClass}-500 font-semibold`}>{name}</h3>
      <p className="text-gray-800 font-bold text-sm">{title}</p>
    </div>
  );
}

export function CardWithBorderAndIcon({
  icon,
  color,
  title = "Title",
  text = "Card text goes here",
  link = "#",
  buttonText = "Read More",
}: CardsTypesWithBordersAndIcon) {
  const { theme } = useTheme();

  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]";
  return (
    <div
      className={`relative shadow-md rounded-2xl w-80 h-[370px] bg-${
        color ? color : currentThemeClass
      }-500`}
    >
      <div className="p-6 bg-white dark:bg-semiblack dark:border-gray-800 rounded-2xl w-full h-[99.5%] hover:h-[96%] flex flex-col justify-center items-center gap-4 border-[1px] mb-1 transition-all duration-300">
        <div className="mb-5">{icon}</div>
        <h3 className="text-2xl font-semibold text-black dark:text-gray-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-500 text-center text-sm">
          {text}
        </p>
        <Link href={`${link}`}>
          <button
            className={` px-4 py-2 bg-${currentThemeClass}-500 border-${currentThemeClass}-500 hover:bg-${currentThemeClass}-600 hover:border-${currentThemeClass}-600 text-white rounded-lg transition`}
          >
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
}
