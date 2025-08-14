import Link from "next/link";

export function IntentCard({
  title,
  prompt,
  description,
  icon,
}: {
  title: string;
  prompt: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  const href = `/chat?q=${encodeURIComponent(prompt)}`;
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md hover:scale-105 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#6B8383] to-[#AFAC7F] flex items-center justify-center text-white">
          {icon || <span>★</span>}
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description || prompt}
          </div>
        </div>
      </div>
    </Link>
  );
}
