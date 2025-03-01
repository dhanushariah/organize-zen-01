
import { useState, useEffect } from "react";

// Define a type for the allowed color variants to match the Badge component
type ColorVariant = "default" | "secondary" | "destructive" | "outline" | "red" | "blue" | "green" | "yellow" | "purple" | "pink" | "indigo" | "gray";

export function useTagsManager() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, ColorVariant>>({});
  
  // Helper function to check if a color is a valid variant
  const isValidColorVariant = (color: string): color is ColorVariant => {
    const validColors: ColorVariant[] = ["default", "secondary", "destructive", "outline", "red", "blue", "green", "yellow", "purple", "pink", "indigo", "gray"];
    return validColors.includes(color as ColorVariant);
  };
  
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
      localStorage.setItem('availableTags', JSON.stringify(defaultTags));
    };
    
    const loadTagColors = () => {
      const savedTagColors = localStorage.getItem('tagColors');
      if (savedTagColors) {
        try {
          const parsedColors = JSON.parse(savedTagColors);
          const validColors: Record<string, ColorVariant> = {};
          
          // Ensure we only use valid color variants
          Object.entries(parsedColors).forEach(([tag, color]) => {
            if (isValidColorVariant(color as string)) {
              validColors[tag] = color as ColorVariant;
            } else {
              validColors[tag] = "gray"; // Fallback to gray if invalid
            }
          });
          
          setTagColors(validColors);
        } catch (error) {
          console.error('Error parsing tag colors:', error);
          setDefaultTagColors();
        }
      } else {
        setDefaultTagColors();
      }
    };
    
    const setDefaultTagColors = () => {
      const defaultColors: Record<string, ColorVariant> = {
        'work': 'blue',
        'personal': 'purple',
        'home': 'green',
        'study': 'indigo',
        'health': 'red'
      };
      setTagColors(defaultColors);
      localStorage.setItem('tagColors', JSON.stringify(defaultColors));
    };
    
    loadTags();
    
    // Set up event listener to handle changes in other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'taskTags' || event.key === 'availableTags') {
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
    localStorage.setItem('availableTags', JSON.stringify(newTags));
  };

  // Function to update tag colors and persist to localStorage
  const updateTagColors = (newColors: Record<string, ColorVariant>) => {
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
