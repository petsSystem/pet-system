import Link from "next/link";

export default function OnboardingHeader() {
  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <div className="text-sm">
        <Link
          className="font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          href="/scheduling-01"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
