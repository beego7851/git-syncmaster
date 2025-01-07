import { useState, useEffect } from "react";
import { AddRepositoryForm } from "@/components/AddRepositoryForm";
import { RepositoryCard } from "@/components/RepositoryCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type RepositoryStatus = "synced" | "pending" | "error";

type Repository = Omit<Database['public']['Tables']['repositories']['Row'], 'status'> & {
  status: RepositoryStatus | null;
};

const Index = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRepositories();
    subscribeToChanges();
  }, []);

  const fetchRepositories = async () => {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch repositories",
      });
      return;
    }

    setRepositories(data?.map(repo => ({
      ...repo,
      status: (repo.status as RepositoryStatus) || 'synced'
    })) || []);
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'repositories' },
        () => {
          fetchRepositories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddRepository = async (name: string, url: string, nickname: string, isMaster: boolean) => {
    if (repositories.some((repo) => repo.url === url)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Repository already exists",
      });
      return;
    }

    const { error } = await supabase
      .from('repositories')
      .insert([
        {
          name,
          url,
          nickname: nickname || null,
          is_master: isMaster,
          status: 'synced' as RepositoryStatus,
          last_sync: new Date().toISOString(),
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add repository",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Repository added successfully",
    });
  };

  const handleSync = async (url: string) => {
    await supabase
      .from('repositories')
      .update({ status: 'pending' as RepositoryStatus })
      .eq('url', url);

    setTimeout(async () => {
      await supabase
        .from('repositories')
        .update({
          status: 'synced' as RepositoryStatus,
          last_sync: new Date().toISOString()
        })
        .eq('url', url);

      toast({
        title: "Success",
        description: "Repository synced successfully",
      });
    }, 2000);
  };

  const handleDelete = async (url: string) => {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('url', url);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete repository",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Repository removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Git Repository Manager
          </h1>
          <p className="text-slate-400">
            Manage and sync your Git repositories in one place
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <div className="space-y-4 bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Add Repository</h2>
            <AddRepositoryForm onAdd={handleAddRepository} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Repositories ({repositories.length})
            </h2>
            {repositories.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-800/50 rounded-lg backdrop-blur-sm">
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