import Image from "next/image";
import NotFoundImage from "@/public/logo.png";

export default function NoDataFound() {
  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="max-w-2xl m-auto mt-16">
          <div className="text-center px-4">
            <div className="inline-flex mb-8">
              <Image
                className="dark:hidden"
                src={NotFoundImage}
                width={176}
                height={176}
                alt="404 illustration"
              />
            </div>
            <div className="mb-6">
              Hmm...Não há dados disponíveis no momento!
            </div>
            {/* <Link href="/" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Back To Dashboard</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
