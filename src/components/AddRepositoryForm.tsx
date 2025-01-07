import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddRepositoryFormProps {
  onAdd: (name: string, url: string, nickname: string, isMaster: boolean) => void;
}

export function AddRepositoryForm({ onAdd }: AddRepositoryFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [nickname, setNickname] = useState("");
  const [isMaster, setIsMaster] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
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

    onAdd(name.trim(), url.trim(), nickname.trim(), isMaster);
    setName("");
    setUrl("");
    setNickname("");
    setIsMaster(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-slate-200">Repository Name*</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nickname" className="text-slate-200">Nickname (Optional)</Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Project Nickname"
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url" className="text-slate-200">Git URL*</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repo.git"
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isMaster"
          checked={isMaster}
          onChange={(e) => setIsMaster(e.target.checked)}
          className="rounded border-slate-700 bg-slate-900/50"
        />
        <Label htmlFor="isMaster" className="text-slate-200">This is a master repository</Label>
      </div>
      <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
        <Plus className="mr-2 h-4 w-4" /> Add Repository
      </Button>
    </form>
  );
}