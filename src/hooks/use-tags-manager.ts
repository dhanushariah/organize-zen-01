
import { useState, useEffect } from "react";

export function useTagsManager() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, string>>({});
  
  // Load available tags from localStorage
  useEffect(() => {
    const loadTags = () => {
      // Try to load tags from localStorage
      const savedTags = localStorage.getItem('taskTags');
      
      if (savedTags) {
        try {
          const parsedTags = JSON.parse(savedTags);
          setAvailableTags(parsedTags);
        } catch (error) {
          console.error('Error parsing stored tags:', error);
          setDefaultTags();
        }
      } else {
        setDefaultTags();
      }
      
      // Load tag colors
      loadTagColors();
    };
    
    const setDefaultTags = () => {
      const defaultTags = ['work', 'personal', 'home', 'study', 'health'];
      setAvailableTags(defaultTags);
      localStorage.setItem('taskTags', JSON.stringify(defaultTags));
    };
    
    const loadTagColors = () => {
      const savedTagColors = localStorage.getItem('tagColors');
      if (savedTagColors) {
        try {
          setTagColors(JSON.parse(savedTagColors));
        } catch (error) {
          console.error('Error parsing tag colors:', error);
          setDefaultTagColors();
        }
      } else {
        setDefaultTagColors();
      }
    };
    
    const setDefaultTagColors = () => {
      const defaultColors = {
        'work': 'blue',
        'personal': 'purple',
        'home': 'green',
        'study': 'indigo',
        'health': 'teal'
      };
      setTagColors(defaultColors);
      localStorage.setItem('tagColors', JSON.stringify(defaultColors));
    };
    
    loadTags();
    
    // Set up event listener to handle changes in other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'taskTags') {
        loadTags();
      }
      if (event.key === 'tagColors') {
        loadTagColors();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to update tags and persist to localStorage
  const updateTags = (newTags: string[]) => {
    setAvailableTags(newTags);
    localStorage.setItem('taskTags', JSON.stringify(newTags));
  };

  // Function to update tag colors and persist to localStorage
  const updateTagColors = (newColors: Record<string, string>) => {
    setTagColors(newColors);
    localStorage.setItem('tagColors', JSON.stringify(newColors));
  };

  return {
    availableTags,
    tagColors,
    updateTags,
    updateTagColors
  };
}
