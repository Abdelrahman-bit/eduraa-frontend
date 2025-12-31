import * as LucideIcons from 'lucide-react';
import React from 'react';

export const renderIcon = (
   iconName: string,
   props?: React.ComponentProps<any>
) => {
   // Map of icon names to Lucide React components
   const IconComponent = (LucideIcons as any)[iconName];

   if (!IconComponent) {
      // Fallback to Folder icon if icon not found
      const FolderIcon = LucideIcons.Folder;
      return <FolderIcon {...props} />;
   }

   return <IconComponent {...props} />;
};

export default renderIcon;
