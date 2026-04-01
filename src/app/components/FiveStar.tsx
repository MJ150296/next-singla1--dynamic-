import Image from "next/image";

const FiveStar: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/5star.png"
        alt="5 star rated image on Google"
        width={300}
        height={300}
      />
      <p className="text-2xl font-bold">on Google</p>
    </div>
  );
};

export default FiveStar;
