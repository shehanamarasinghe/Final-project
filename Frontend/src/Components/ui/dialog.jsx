import React from 'react';

export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export const DialogTrigger = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg w-full max-w-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
};