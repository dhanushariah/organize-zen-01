
import { useState, useEffect } from "react";

export function useTagsManager() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, string>>({});
  
  // Load available tags from localStorage
  useEffect(() => {
    const savedTags = localStorage.getItem('availableTags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    } else {
      setAvailableTags(['work', 'personal', 'home', 'study', 'health']);
    }
    
    // Load tag colors
    const savedTagColors = localStorage.getItem('tagColors');
    if (savedTagColors) {
      setTagColors(JSON.parse(savedTagColors));
    }
  }, []);

  return {
    availableTags,
    tagColors
  };
}
