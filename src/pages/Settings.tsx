
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Laptop } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagEditor } from "@/components/task/TagEditor";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [editingTagColor, setEditingTagColor] = useState<string | null>(null);

  // Load available tags from localStorage on mount
  useEffect(() => {
    const savedTags = localStorage.getItem('availableTags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    } else {
      const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
      setAvailableTags(defaultTags);
      localStorage.setItem('availableTags', JSON.stringify(defaultTags));
    }
  }, []);

  // Save tags to localStorage when they change
  useEffect(() => {
    if (availableTags.length > 0) {
      localStorage.setItem('availableTags', JSON.stringify(availableTags));
    }
  }, [availableTags]);

  const addNewTag = () => {
    if (newTagName.trim() && !availableTags.includes(newTagName.toLowerCase())) {
      setAvailableTags([...availableTags, newTagName.toLowerCase()]);
      setNewTagName("");
      setAddingNewTag(false);
    }
  };

  const deleteTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableTags.length > 1) {
      setAvailableTags(availableTags.filter(tag => tag !== tagToDelete));
    }
  };

  const updateTagColor = (tag: string, color: string) => {
    // Store tag colors in localStorage
    const tagColors = JSON.parse(localStorage.getItem('tagColors') || '{}');
    tagColors[tag] = color;
    localStorage.setItem('tagColors', JSON.stringify(tagColors));
    setEditingTagColor(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your TaskSheet experience</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Theme Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Theme</h2>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <p className="text-muted-foreground">Choose your preferred theme</p>
            
            <RadioGroup 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="light" 
                  className="sr-only" 
                />
                <Label 
                  htmlFor="light"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'light' ? 'border-primary' : ''}`}
                >
                  <Sun className="mb-2 h-6 w-6" />
                  <span>Light</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="dark" 
                  className="sr-only" 
                />
                <Label 
                  htmlFor="dark"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'dark' ? 'border-primary' : ''}`}
                >
                  <Moon className="mb-2 h-6 w-6" />
                  <span>Dark</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="system" 
                  className="sr-only" 
                />
                <Label 
                  htmlFor="system"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'system' ? 'border-primary' : ''}`}
                >
                  <Laptop className="mb-2 h-6 w-6" />
                  <span>System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Card>
        
        {/* Tag Management */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Tag Management</h2>
          <Separator className="mb-4" />
          
          <div className="space-y-6">
            <p className="text-muted-foreground">Customize your task tags</p>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {availableTags.map(tag => (
                  <div 
                    key={tag} 
                    className="flex items-center justify-between p-2 border rounded-md"
                    onClick={() => setEditingTagColor(tag)}
                  >
                    <span className={`tag tag-${tag} mr-2`}>{tag}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => deleteTag(tag, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {!addingNewTag ? (
                <Button 
                  variant="outline" 
                  onClick={() => setAddingNewTag(true)}
                  className="w-full"
                >
                  Add New Tag
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addNewTag}>
                    Add
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setAddingNewTag(false);
                      setNewTagName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            {editingTagColor && (
              <div className="p-4 border rounded-md bg-background">
                <h3 className="font-medium mb-2">Choose color for tag: {editingTagColor}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'indigo', 'teal'].map(color => (
                    <button
                      key={color}
                      className={`tag tag-${color} py-2 px-4 cursor-pointer`}
                      onClick={() => updateTagColor(editingTagColor, color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setEditingTagColor(null)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
