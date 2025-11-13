interface Props {
  children?: React.ReactNode;
}

export function ContentPS({ children }: Props) {
  return (
    <div className="flex bg-gray-100 w-full  h-full	 p-4 rounded-b-lg  z-1">
      <div className="bg-white rounded-lg p-4 w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
