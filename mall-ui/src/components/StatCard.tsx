import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function StatCard({
  title, value, subtitle, color
}: { title: string; value: string | number; subtitle?: string; color?: "primary"|"secondary"|"success"|"warning"|"error"|"info"; }) {
  return (
    <Card sx={{ overflow: "hidden" }}>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>{title}</Typography>
          <Typography variant="h4" color={color || "primary"} sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
          {subtitle && <Typography variant="body2" sx={{ opacity: 0.8 }}>{subtitle}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
