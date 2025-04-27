// Status badge component
import {Badge} from "@/components/ui/badge";

export default function StatusBadge({status}: { status: string }) {
    let variant: "default" | "outline" | "secondary" | "destructive" = "outline";

    switch (status) {
        case "active":
            variant = "default";
            break;
        case "completed":
            variant = "secondary";
            break;
        case "withdrawn":
            variant = "destructive";
            break;
    }

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
}