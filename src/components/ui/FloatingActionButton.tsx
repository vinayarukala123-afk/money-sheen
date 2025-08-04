import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  return (
    <Button
      variant="floating"
      size="floating"
      onClick={onClick}
      className={cn("transition-smooth", className)}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};