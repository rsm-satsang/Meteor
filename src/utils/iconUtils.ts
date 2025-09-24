// Utility functions for loading .ico icons from assets/icons/

interface IconImport {
  default: string;
}

// Dynamic icon imports for .ico files
const iconModules = import.meta.glob('/src/assets/icons/*.ico', { eager: true });

// Helper function to load ico icons
export const loadIcon = (iconName: string): string | null => {
  const iconPath = `/src/assets/icons/${iconName}.ico`;
  const iconModule = iconModules[iconPath] as IconImport | undefined;
  
  if (iconModule?.default) {
    return iconModule.default;
  }
  
  // Fallback to direct path if module loading fails
  return `/src/assets/icons/${iconName}.ico`;
};

// Helper function to get icon with fallback
export const getIcon = (iconName: string, fallback?: string): string => {
  const icon = loadIcon(iconName);
  return icon || fallback || '/src/assets/icons/default.ico';
};

// Icon component for .ico files
interface IcoIconProps {
  name: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

export const IcoIcon = ({ 
  name, 
  alt, 
  className = "w-6 h-6",
  fallback
}: IcoIconProps) => {
  const iconSrc = getIcon(name, fallback);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (fallback && target.src !== fallback) {
      target.src = fallback;
    } else {
      target.style.display = 'none';
    }
  };
  
  return (
    <img 
      src={iconSrc} 
      alt={alt || name} 
      className={className}
      onError={handleError}
    />
  );
};