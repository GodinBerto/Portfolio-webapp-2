import { ReactNode } from "react";

export type CardsTypes1 = {
  link?: string;
  img: string;
  title?: string;
  text?: string;
  buttonText?: string; // Optional field
};

export interface RatingCardProps {
  imgSrc: string;
  name: string;
  title: string;
  description: string;
  rating: number; // User-selected rating (1-5)
}

export interface CardsTypesWithBordersAndIcon {
  color?: string;
  icon?: ReactNode | string; // Accepts a React component or a string
  title?: string;
  text?: string;
  link?: string;
  buttonText?: string;
}
