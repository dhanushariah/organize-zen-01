
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TagManagement = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tagColors, setTagColors] = useState<Record<string, string>>({});
  
  // Load tags from localStorage on component mount
  useEffect(() => {
    const loadSavedTags = () => {
      try {
        const storedTags = localStorage.getItem('taskTags');
        if (storedTags) {
          const parsedTags = JSON.parse(storedTags);
          setTags(parsedTags);
        } else {
          // Initialize with default tags if no stored tags are found
          const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
          setTags(defaultTags);
          saveTags(defaultTags);
        }
        
        // Load tag colors
        const storedColors = localStorage.getItem('tagColors');
        if (storedColors) {
          setTagColors(JSON.parse(storedColors));
        } else {
          // Initialize with default colors
          const defaultColors: Record<string, string> = {};
          ['work', 'personal', 'home', 'study', 'health'].forEach((tag, index) => {
            const colorKey = ['blue', 'purple', 'green', 'indigo', 'red'][index % 5];
            defaultColors[tag] = colorKey;
          });
          setTagColors(defaultColors);
          localStorage.setItem('tagColors', JSON.stringify(defaultColors));
        }
      } catch (error) {
        console.error('Error loading tags:', error);
        // Initialize with default tags on error
        const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
        setTags(defaultTags);
        saveTags(defaultTags);
      }
    };
    
    loadSavedTags();
  }, []);
  
  // Save tags to localStorage
  const saveTags = (tagsToSave: string[]) => {
    try {
      const tagsJSON = JSON.stringify(tagsToSave);
      localStorage.setItem('taskTags', tagsJSON);
      localStorage.setItem('availableTags', tagsJSON);
      
      // Also add colors for new tags
      const updatedColors = { ...tagColors };
      tagsToSave.forEach(tag => {
        if (!updatedColors[tag]) {
          const colorKeys = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];
          updatedColors[tag] = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        }
      });
      localStorage.setItem('tagColors', JSON.stringify(updatedColors));
      setTagColors(updatedColors);
    } catch (error) {
      console.error('Error saving tags:', error);
      toast.error('Failed to save tags');
    }
  };
  
  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    if (tags.includes(newTag.trim())) {
      toast.error('This tag already exists');
      return;
    }
    
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    saveTags(updatedTags);
    setNewTag('');
    toast.success('Tag added successfully');
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToDelete);
    setTags(updatedTags);
    saveTags(updatedTags);
    toast.success('Tag deleted successfully');
  };
  
  const updateTagColor = (tag: string, color: string) => {
    const updatedColors = { ...tagColors, [tag]: color };
    setTagColors(updatedColors);
    localStorage.setItem('tagColors', JSON.stringify(updatedColors));
    toast.success(`Color updated for ${tag}`);
  };
  
  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'gray', label: 'Gray' }
  ];
  
  return (
    <div className="p-4 bg-card rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-4">Tag Management</h2>
      <p className="text-muted-foreground mb-6">Create and manage tags for your tasks</p>
      
      <div className="flex items-center gap-2 mb-6">
        <Input
          type="text"
          placeholder="New tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <Button onClick={handleAddTag} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Tag
        </Button>
      </div>
      
      {tags.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No tags created yet. Add your first tag above.
        </div>
      ) : (
        <div className="space-y-4">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center justify-between gap-2 p-2 bg-background/50 rounded-md">
              <Badge 
                className={`tag-${tagColors[tag] || 'gray'} px-3 py-1`}
              >
                {tag}
              </Badge>
              
              <div className="flex items-center gap-2">
                <Select 
                  value={tagColors[tag] || 'gray'} 
                  onValueChange={(value) => updateTagColor(tag, value)}
                >
                  <SelectTrigger className="w-24 h-7">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 bg-${color.value}-500`}></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleDeleteTag(tag)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
