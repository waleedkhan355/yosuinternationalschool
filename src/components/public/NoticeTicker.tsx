import { useSchool } from "@/context/SchoolContext";
import { Bell } from "lucide-react";

export default function NoticeTicker() {
  const { notifications } = useSchool();
  const active = notifications.filter((n) => n.active);
  if (!active.length) return null;

  const text = active.map((n) => {
    const prefix = n.level === "urgent" ? "🔴 URGENT: " : n.level === "holiday" ? "🟢 HOLIDAY: " : "📌 ";
    return prefix + n.message;
  }).join("   •••   ");

  return (
    <div className="bg-[hsl(152_55%_14%)] border-b border-[hsl(43_90%_52%)/30] overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 bg-[hsl(43_90%_52%)] px-4 py-2 text-[hsl(152_55%_10%)] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
          <Bell className="w-3 h-3" />
          Live Notices
        </div>
        <div className="overflow-hidden flex-1 py-2">
          <p className="animate-marquee whitespace-nowrap text-green-100 text-sm px-4">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
