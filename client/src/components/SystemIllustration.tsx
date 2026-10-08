import { FileText, Database, Workflow } from "lucide-react";
import { FluidAIWorkloads } from "@/components/ui/fluid-ai-workloads";
import GatewayOverhead from "@/components/ui/gateway-svg-illustration";
import { useI18n } from "@/lib/i18n";

export default function SystemIllustration({ variant = "workloads", compact = false }: { variant?: "workloads" | "gateway"; compact?: boolean }) {
  const { lang } = useI18n();
  const primary = "hsl(var(--primary))", ring = "hsl(var(--ring))", border = "hsl(var(--border))", background = "hsl(var(--card))";
  return <figure className={`cult-system-illustration ${compact ? "illustration-compact" : ""}`}>
    {variant === "workloads" ? <FluidAIWorkloads role="img" aria-label={lang === "id" ? "Ilustrasi data masuk ke sistem AI lalu diteruskan ke beberapa tools bisnis" : "Data enters an AI system and branches into business tools"} backgroundColor="transparent" cardFill={background} cardStroke={border} bubbleFill="hsl(var(--muted))" bubbleStroke={border} logoColor={ring} lineColorTop={ring} lineColorUpperMid={primary} lineColorLowerMid={ring} lineColorBottom={primary} connectorLineColor={border} connectorDotFill={background} connectorDotStroke={border} /> : <GatewayOverhead showBackgroundGrid role="img" aria-label={lang === "id" ? "Ilustrasi dokumen, workflow, dan database yang terhubung" : "Connected documents, workflows, and databases"} backgroundColor="transparent" borderColor={border} leftLineColor={ring} centerLineColor={primary} rightLineColor={ring} logoColor={ring} iconColor={ring} leftIcon={<FileText x={41} y={25} width={14} height={14} color={ring} />} centerIcon={<Workflow x={125} y={25} width={14} height={14} color={ring} />} rightIcon={<Database x={209} y={25} width={14} height={14} color={ring} />} />}
    <figcaption>{variant === "workloads" ? "Business data → AI orchestration → Tool execution" : "Documents · Workflows · Connected systems"}</figcaption>
  </figure>;
}

