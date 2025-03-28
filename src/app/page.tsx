"use client";

import {
  Card,
  CardWithBorderAndIcon,
  RatingCard,
} from "@/components/do-not-touch/cards";
import { HomeIcon, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="p-10 flex gap-4 flex-wrap">
      <Card img={"/images/cards/profile.jpg"} />
      <RatingCard
        imgSrc="/images/cards/profile.jpg" // Path to profile image
        name="Regina Miles"
        title="Designer"
        description="Slate helps you see how many more days you need to work to reach your financial goal for the month and year."
        rating={2} // User-selected rating (change as needed)
      />
      <CardWithBorderAndIcon
        icon={<ShoppingCart size={100} color="yellow" />}
      />
    </div>
  );
}
