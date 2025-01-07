import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddRepositoryFormProps {
  onAdd: (name: string, url: string) => void;
}

export function AddRepositoryForm({ onAdd }: AddRepositoryFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (!url.endsWith(".git")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "URL must end with .git",
      });
      return;
    }

    onAdd(name.trim(), url.trim());
    setName("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Repository Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url">Git URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repo.git"
        />
      </div>
      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Repository
      </Button>
    </form>
  );
}