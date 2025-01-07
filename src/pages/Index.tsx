import { useState } from "react";
import { AddRepositoryForm } from "@/components/AddRepositoryForm";
import { RepositoryCard } from "@/components/RepositoryCard";
import { useToast } from "@/components/ui/use-toast";

interface Repository {
  name: string;
  url: string;
  status: "synced" | "pending" | "error";
  lastSync?: string;
}

const Index = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { toast } = useToast();

  const handleAddRepository = (name: string, url: string) => {
    if (repositories.some((repo) => repo.url === url)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Repository already exists",
      });
      return;
    }

    setRepositories([
      ...repositories,
      {
        name,
        url,
        status: "synced",
        lastSync: new Date().toLocaleString(),
      },
    ]);

    toast({
      title: "Success",
      description: "Repository added successfully",
    });
  };

  const handleSync = (url: string) => {
    setRepositories(
      repositories.map((repo) =>
        repo.url === url
          ? { ...repo, status: "pending" }
          : repo
      )
    );

    // Simulate sync
    setTimeout(() => {
      setRepositories(
        repositories.map((repo) =>
          repo.url === url
            ? { ...repo, status: "synced", lastSync: new Date().toLocaleString() }
            : repo
        )
      );

      toast({
        title: "Success",
        description: "Repository synced successfully",
      });
    }, 2000);
  };

  const handleDelete = (url: string) => {
    setRepositories(repositories.filter((repo) => repo.url !== url));
    toast({
      title: "Success",
      description: "Repository removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Git Repository Manager</h1>
          <p className="text-muted-foreground">
            Manage and sync your Git repositories in one place
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Add Repository</h2>
            <AddRepositoryForm onAdd={handleAddRepository} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Repositories ({repositories.length})
            </h2>
            {repositories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No repositories added yet
              </div>
            ) : (
              <div className="grid gap-4">
                {repositories.map((repo) => (
                  <RepositoryCard
                    key={repo.url}
                    repository={repo}
                    onSync={handleSync}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;