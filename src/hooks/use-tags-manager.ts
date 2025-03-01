
import { useState, useEffect } from "react";

export function useTagsManager() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, string>>({});
  
  // Load available tags from localStorage
  useEffect(() => {
    // First try to load from taskTags (the source of truth)
    const savedTags = localStorage.getItem('taskTags');
    
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags);
        setAvailableTags(parsedTags);
        
        // Also ensure availableTags is in sync
        localStorage.setItem('availableTags', savedTags);
      } catch (error) {
        console.error('Error parsing stored tags:', error);
        
        // Fallback to default tags
        const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
        setAvailableTags(defaultTags);
        localStorage.setItem('taskTags', JSON.stringify(defaultTags));
        localStorage.setItem('availableTags', JSON.stringify(defaultTags));
      }
    } else {
      // If no taskTags, check availableTags as fallback
      const fallbackTags = localStorage.getItem('availableTags');
      
      if (fallbackTags) {
        try {
          setAvailableTags(JSON.parse(fallbackTags));
          // Sync back to taskTags
          localStorage.setItem('taskTags', fallbackTags);
        } catch (error) {
          console.error('Error parsing fallback tags:', error);
          
          // Set defaults if both failed
          const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
          setAvailableTags(defaultTags);
          localStorage.setItem('taskTags', JSON.stringify(defaultTags));
          localStorage.setItem('availableTags', JSON.stringify(defaultTags));
        }
      } else {
        // No tags found anywhere, set defaults
        const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
        setAvailableTags(defaultTags);
        localStorage.setItem('taskTags', JSON.stringify(defaultTags));
        localStorage.setItem('availableTags', JSON.stringify(defaultTags));
      }
    }
    
    // Load tag colors
    const savedTagColors = localStorage.getItem('tagColors');
    if (savedTagColors) {
      try {
        setTagColors(JSON.parse(savedTagColors));
      } catch (error) {
        console.error('Error parsing tag colors:', error);
        setTagColors({});
      }
    }
  }, []);

  return {
    availableTags,
    tagColors
  };
}
