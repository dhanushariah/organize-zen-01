
import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TAG_COLORS = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
];

interface TagEditorProps {
  currentTag?: string;
  onSelectTag: (tag: string) => void;
}

export const TagEditor = ({ currentTag, onSelectTag }: TagEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    const storedTags = localStorage.getItem('taskTags');
    if (storedTags) {
      try {
        setAvailableTags(JSON.parse(storedTags));
      } catch (error) {
        console.error('Error parsing stored tags:', error);
        setAvailableTags([]);
      }
    }
  }, [isOpen]); // Reload when popover opens to get latest tags
  
  const getTagColor = (tag: string) => {
    // Simple hash function to assign consistent colors
    const hashCode = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[hashCode % TAG_COLORS.length];
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
                  className={`${getTagColor(tag)} px-2 py-1 cursor-pointer w-full justify-start ${
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
