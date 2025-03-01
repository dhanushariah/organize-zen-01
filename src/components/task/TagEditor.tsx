
import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Define the type for allowed color variants
type ColorVariant = "default" | "secondary" | "destructive" | "outline" | "red" | "blue" | "green" | "yellow" | "purple" | "pink" | "indigo" | "gray";

interface TagEditorProps {
  currentTag?: string;
  onSelectTag: (tag: string) => void;
}

export const TagEditor = ({ currentTag, onSelectTag }: TagEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, ColorVariant>>({});
  
  useEffect(() => {
    const loadData = () => {
      // Load available tags
      const storedTags = localStorage.getItem('taskTags');
      if (storedTags) {
        try {
          setAvailableTags(JSON.parse(storedTags));
        } catch (error) {
          console.error('Error parsing stored tags:', error);
          setAvailableTags([]);
        }
      }
      
      // Load tag colors
      const storedColors = localStorage.getItem('tagColors');
      if (storedColors) {
        try {
          const parsedColors = JSON.parse(storedColors);
          const validColors: Record<string, ColorVariant> = {};
          
          // Validate each color
          Object.entries(parsedColors).forEach(([tag, color]) => {
            validColors[tag] = isValidColorVariant(color as string) ? color as ColorVariant : "gray";
          });
          
          setTagColors(validColors);
        } catch (error) {
          console.error('Error parsing tag colors:', error);
          setTagColors({});
        }
      }
    };
    
    loadData();
  }, [isOpen]); // Reload when popover opens to get latest tags
  
  // Helper function to check if a color is a valid variant
  const isValidColorVariant = (color: string): color is ColorVariant => {
    const validColors: ColorVariant[] = ["default", "secondary", "destructive", "outline", "red", "blue", "green", "yellow", "purple", "pink", "indigo", "gray"];
    return validColors.includes(color as ColorVariant);
  };
  
  const getTagColor = (tag: string): ColorVariant => {
    return tagColors[tag] || "gray";
  };
  
  const handleSelect = (tag: string) => {
    onSelectTag(tag);
    setIsOpen(false);
    toast.success(`Tag "${tag}" assigned to task`);
  };
  
  const handleClear = () => {
    onSelectTag('');
    setIsOpen(false);
    toast.success('Tag removed from task');
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full h-7 w-7 ${currentTag ? 'bg-slate-100' : ''}`}
          aria-label="Add tag"
        >
          <Tag className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-2">Select Tag</h4>
          
          {availableTags.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              No tags created yet. Create tags in Settings.
            </p>
          ) : (
            <div className="space-y-1.5">
              {availableTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant={getTagColor(tag)}
                  className={`px-2 py-1 cursor-pointer w-full justify-start ${
                    currentTag === tag ? 'ring-2 ring-offset-1' : ''
                  }`}
                  onClick={() => handleSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
              
              {currentTag && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 h-7 text-xs"
                  onClick={handleClear}
                >
                  Clear Tag
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
