import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Repository {
  name: string;
  url: string;
  status: "synced" | "pending" | "error";
  lastSync?: string;
}

interface RepositoryCardProps {
  repository: Repository;
  onSync: (url: string) => void;
  onDelete: (url: string) => void;
}

export function RepositoryCard({ repository, onSync, onDelete }: RepositoryCardProps) {
  const statusColors = {
    synced: "text-git-success",
    pending: "text-git-pending",
    error: "text-git-error",
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{repository.name}</CardTitle>
        <div className={cn("flex items-center gap-2", statusColors[repository.status])}>
          <GitBranch className="h-4 w-4" />
          <span className="text-sm capitalize">{repository.status}</span>
        </div>
      </CardHeader>
      <CardContent>
        <code className="font-mono text-sm text-muted-foreground break-all">{repository.url}</code>
        {repository.lastSync && (
          <p className="text-sm text-muted-foreground mt-2">
            Last synced: {repository.lastSync}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(repository.url)}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSync(repository.url)}
          disabled={repository.status === "pending"}
        >
          <RefreshCw className={cn("h-4 w-4", repository.status === "pending" && "animate-spin")} />
        </Button>
      </CardFooter>
    </Card>
  );
}