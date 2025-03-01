
import React, { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export const TagManagement = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Load tags from localStorage on component mount
  useEffect(() => {
    const storedTags = localStorage.getItem('taskTags');
    if (storedTags) {
      try {
        setTags(JSON.parse(storedTags));
      } catch (error) {
        console.error('Error parsing stored tags:', error);
        setTags([]);
      }
    }
  }, []);
  
  // Save tags to localStorage when they change
  useEffect(() => {
    localStorage.setItem('taskTags', JSON.stringify(tags));
  }, [tags]);
  
  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    if (tags.includes(newTag.trim())) {
      toast.error('This tag already exists');
      return;
    }
    
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    toast.success('Tag added successfully');
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    toast.success('Tag deleted successfully');
  };
  
  const getTagColor = (tag: string) => {
    // Simple hash function to assign consistent colors
    const hashCode = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[hashCode % TAG_COLORS.length];
  };
  
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
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              className={`${getTagColor(tag)} px-3 py-1 flex items-center gap-1`}
            >
              {tag}
              <button 
                onClick={() => handleDeleteTag(tag)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
