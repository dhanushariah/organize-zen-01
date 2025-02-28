
import { useState } from "react";

const Weekly = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Weekly Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your tasks for the week</p>
      </div>
      
      {/* Weekly content goes here */}
      <div className="flex justify-center">
        <div className="p-12 border rounded-lg text-center">
          <p className="text-muted-foreground">Weekly task management coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
