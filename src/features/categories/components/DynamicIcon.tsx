import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[name] || Icons.Folder;
  return <IconComponent className={className} />;
};