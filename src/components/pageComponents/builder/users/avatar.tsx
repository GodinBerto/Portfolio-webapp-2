import Tooltip from "@/components/do-not-touch/ui/tooltip";
import Image from "next/image";

type Props = {
  name: string;
  otherStyles?: string;
};

const Avatar = ({ name, otherStyles }: Props) => (
  <Tooltip content={name} position="bottom">
    <div className={`relative h-9 w-9 rounded-full ${otherStyles}`}>
      <Image
        src={`/images/cards/profile.jpg`}
        fill
        className="rounded-full"
        alt={name}
      />
    </div>
  </Tooltip>
);

export default Avatar;
