import { motion } from "framer-motion";
import { useSchool } from "@/context/SchoolContext";
import { Bell, AlertCircle, PartyPopper, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const levelConfig = {
  urgent: { icon: AlertCircle, label: "Urgent", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", icon_color: "text-red-500" },
  holiday: { icon: PartyPopper, label: "Holiday", bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon_color: "text-emerald-500" },
  info: { icon: Info, label: "Info", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon_color: "text-blue-500" },
};

export default function Notifications() {
  const { notifications } = useSchool();
  const active = notifications.filter((n) => n.active);
  const inactive = notifications.filter((n) => !n.active);
  const isMobile = useIsMobile();

  return (
    <div className="py-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? -5 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.35 : 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(152_25%_90%)] mb-5">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Notifications & Bulletins</h1>
          <div className="gold-divider max-w-[100px] mx-auto" />
          <p className="text-muted-foreground mt-4">Official announcements, holidays, exam schedules, and parent-teacher meetings.</p>
        </motion.div>

        {/* Active */}
        {active.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Active Announcements
            </h2>
            <div className="space-y-3">
              {active.map((n, i) => {
                const cfg = levelConfig[n.level];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 5 : 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: isMobile ? i * 0.04 : i * 0.06, duration: 0.35 }}
                    className={`flex items-start gap-4 p-5 rounded-xl border ${cfg.bg} ${cfg.border}`}
                    data-testid={`notification-${n.id}`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.icon_color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(n.timestamp).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">{n.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Archived */}
        {inactive.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Archived Notices
            </h2>
            <div className="space-y-2 opacity-60">
              {inactive.map((n, i) => {
                const cfg = levelConfig[n.level];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: isMobile ? i * 0.03 : i * 0.04, duration: 0.3 }}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card"
                  >
                    <Icon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.badge} mr-2`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.timestamp).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-serif text-lg">No notices posted yet.</p>
            <p className="text-sm mt-1">Check back soon for school announcements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
