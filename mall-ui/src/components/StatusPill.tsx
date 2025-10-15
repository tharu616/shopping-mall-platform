import { Chip } from "@mui/material";

const map: Record<string, { color: "default" | "primary" | "secondary" | "success" | "warning" | "error"; }> = {
  PENDING: { color: "warning" },
  CONFIRMED: { color: "primary" },
  PROCESSING: { color: "secondary" },
  SHIPPED: { color: "info" as any },
  DELIVERED: { color: "success" },
  CANCELLED: { color: "error" },
  VERIFIED: { color: "success" },
  REJECTED: { color: "error" },
  APPROVED: { color: "success" }
};

export default function StatusPill({ value }: { value: string }) {
  const cfg = map[value] || { color: "default" };
  return (
    <Chip label={value} color={cfg.color} size="small" sx={{ fontWeight: 700 }} />
  );
}
