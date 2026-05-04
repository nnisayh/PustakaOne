"use client"

export type UserStatus = "Active" | "Inactive" | "Blocked" | "Pending"

export default function StatusBadge({ status, className = "" }: { status: UserStatus, className?: string }) {
  const cfg = {
    Active:   { bg: "bg-[#DCFCE7] text-[#16A34A]", dot: "bg-[#16A34A]" },
    Inactive: { bg: "bg-[#F3F4F6] text-[#6B7280]", dot: "bg-[#6B7280]" },
    Blocked:  { bg: "bg-[#FEE2E2] text-[#DC2626]", dot: "bg-[#DC2626]" },
    Pending:  { bg: "bg-[#FEF9C3] text-[#CA8A04]", dot: "bg-[#CA8A04]" },
  }[status] || { bg: "bg-[#F3F4F6] text-[#6B7280]", dot: "bg-[#6B7280]" }

  return (
    <div className="w-fit">
      <span className={`inline-flex items-center gap-1.5 px-[10px] py-[4px] rounded-[20px] text-[11px] font-semibold ${cfg.bg} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {status}
      </span>
    </div>
  )
}
