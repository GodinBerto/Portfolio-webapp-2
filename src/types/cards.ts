export type CardsTypes1 = {
  link?: string;
  img: string;
  heading?: string;
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
