import { useState } from "react";

const Monthly = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Monthly Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your tasks for the month</p>
      </div>
      
      {/* Monthly content goes here */}
      <div className="flex justify-center">
        <div className="p-12 border rounded-lg text-center">
          <p className="text-muted-foreground">Monthly task management coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Monthly;
