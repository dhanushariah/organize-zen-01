
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
          
          // Ensure consistent storage
          localStorage.setItem('taskTags', JSON.stringify(parsedTags));
          localStorage.setItem('availableTags', JSON.stringify(parsedTags));
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
      localStorage.setItem('availableTags', JSON.stringify(defaultTags));
    };
    
    const loadTagColors = () => {
      const savedTagColors = localStorage.getItem('tagColors');
      if (savedTagColors) {
        try {
          setTagColors(JSON.parse(savedTagColors));
        } catch (error) {
          console.error('Error parsing tag colors:', error);
          setTagColors({});
        }
      }
    };
    
    loadTags();
    
    // Set up event listener to handle changes in other tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key === 'taskTags' || event.key === 'availableTags') {
        loadTags();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  return {
    availableTags,
    tagColors
  };
}
