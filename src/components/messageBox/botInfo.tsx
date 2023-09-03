interface IProps {
  infoMessage: string;
}

export default function BotInfo({ infoMessage }: IProps) {
  return (
    <div className="flex justify-center text-white top-1/2 w-full md:max-w-screen-md absolute">
      <p>{infoMessage}</p>
    </div>
  );
}
