interface Props {
  title: string;
  subTitle: string;
}

export function TitlePS({ title, subTitle }: Props) {
  return (
    <div className="flex flex-col">
      <h1 className="font-black text-3xl text-gray-600">{title}</h1>
      <h1 className="font-light  text-sm text-gray-600">{subTitle}</h1>
    </div>
  );
}
