
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export const TagManagement = () => {
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
  );
};
