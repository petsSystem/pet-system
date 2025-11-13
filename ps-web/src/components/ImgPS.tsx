import Image, { ImageLoader } from "next/image";

interface ImgPSProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  loader?: ImageLoader;
}

export function ImgPS({ src, alt, width, height, loader }: ImgPSProps) {
  return (
    <Image src={src} width={width} height={height} alt={alt} loader={loader} />
  );
}
