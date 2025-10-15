import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function FormCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card sx={{ maxWidth: 560, mx: "auto" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>{subtitle}</Typography>}
        {children}
      </CardContent>
    </Card>
  );
}
