"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "./user-profile";

export function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
  };

  const handleLogout = () => {
    console.log(" User logged out");
    // Handle logout logic here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
                Ideas
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <UserProfile user={mockUser} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
}
