import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Repository {
  name: string;
  url: string;
  status: "synced" | "pending" | "error";
  last_sync?: string;
  nickname?: string;
  is_master?: boolean;
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
    <Card className="w-full animate-fade-in bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-white">
            {repository.name}
            {repository.is_master && (
              <span className="ml-2 text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                Master
              </span>
            )}
          </CardTitle>
          {repository.nickname && (
            <p className="text-sm text-slate-400">
              {repository.nickname}
            </p>
          )}
        </div>
        <div className={cn("flex items-center gap-2", statusColors[repository.status])}>
          <GitBranch className="h-4 w-4" />
          <span className="text-sm capitalize">{repository.status}</span>
        </div>
      </CardHeader>
      <CardContent>
        <code className="font-mono text-sm text-slate-400 break-all">{repository.url}</code>
        {repository.last_sync && (
          <p className="text-sm text-slate-500 mt-2">
            Last synced: {new Date(repository.last_sync).toLocaleString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(repository.url)}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent border-slate-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSync(repository.url)}
          disabled={repository.status === "pending"}
          className="bg-transparent border-slate-700 text-white hover:bg-slate-700"
        >
          <RefreshCw className={cn("h-4 w-4", repository.status === "pending" && "animate-spin")} />
        </Button>
      </CardFooter>
    </Card>
  );
}