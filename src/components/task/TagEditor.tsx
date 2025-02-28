
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Palette, Plus, Trash2 } from "lucide-react";

// Defining tag colors
const TAG_COLORS = ["red", "blue", "green", "purple", "yellow", "pink", "indigo", "teal"];

interface TagEditorProps {
  taskId: string;
  availableTags: string[];
  onUpdateTag: (newTag: string) => void;
  onUpdateTagColor: (color: string) => void;
  onTagDelete: (tag: string, e: React.MouseEvent) => void;
  showColorPicker: boolean;
  setShowColorPicker: (taskId: string | null) => void;
  closeTagEditor: () => void;
}

export const TagEditor = ({
  taskId,
  availableTags,
  onUpdateTag,
  onUpdateTagColor,
  onTagDelete,
  showColorPicker,
  setShowColorPicker,
  closeTagEditor
}: TagEditorProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [addingNewTag, setAddingNewTag] = useState(false);

  const handleAddNewTag = () => {
    if (newTagName.trim() && !availableTags.includes(newTagName.toLowerCase())) {
      // This will be handled by the parent component's state
      onUpdateTag(newTagName.toLowerCase());
      setNewTagName("");
      setAddingNewTag(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium">Select Tag</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-5 w-5"
          onClick={closeTagEditor}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {availableTags.map(tag => (
          <Button 
            key={tag}
            variant="outline" 
            size="sm" 
            onClick={() => onUpdateTag(tag)}
            className="h-6 px-2 text-xs flex items-center gap-1"
          >
            {tag}
            <Trash2 
              className="h-3 w-3 text-destructive ml-1" 
              onClick={(e) => onTagDelete(tag, e)}
            />
          </Button>
        ))}
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setAddingNewTag(true)}
          className="h-6 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          New
        </Button>
      </div>
      
      {addingNewTag && (
        <div className="flex items-center gap-1 mt-1">
          <Input
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="h-6 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddNewTag();
              }
            }}
          />
          <Button
            size="icon"
            className="h-6 w-6"
            onClick={handleAddNewTag}
          >
            <Check className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="mt-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setShowColorPicker(showColorPicker ? null : taskId)}
          className="h-6 px-2 text-xs flex items-center w-full justify-between"
        >
          <span className="flex items-center">
            <Palette className="h-3 w-3 mr-1" />
            Choose Color
          </span>
          {showColorPicker ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </Button>
      </div>
      
      {showColorPicker && (
        <div className="mt-1 p-2 bg-background rounded-md border border-border">
          <div className="flex flex-wrap gap-2">
            {TAG_COLORS.map(color => (
              <Button 
                key={color}
                variant="outline" 
                className={`h-8 w-8 p-0 tag-${color}`}
                onClick={() => onUpdateTagColor(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
