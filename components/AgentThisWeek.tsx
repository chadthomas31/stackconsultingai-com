import {
  CalendarCheck,
  Database,
  PhoneCall,
  UserCheck,
  Users,
} from "lucide-react";

const capabilities = [
  {
    label: "Answer calls",
    icon: PhoneCall,
  },
  {
    label: "Capture leads",
    icon: UserCheck,
  },
  {
    label: "Qualify customers",
    icon: Users,
  },
  {
    label: "Schedule appointments",
    icon: CalendarCheck,
  },
  {
    label: "Update CRM",
    icon: Database,
  },
];

export default function AgentThisWeek() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-md border border-border bg-soft p-8 md:p-10">
          <div className="max-w-3xl">
            <span className="section-kicker">This week</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 tracking-tight">
              What an AI agent can do for your business this week.
            </h2>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {capabilities.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm font-medium text-navy-900"
              >
                <Icon className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
