import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  variant = 'default', // 'default' | 'outline' | 'hover'
  className = ''
}) => {
  const variants = {
    default: 'bg-white dark:bg-[#0a3553]',
    outline: 'border border-gray-200 dark:border-gray-700 bg-transparent',
    hover: 'bg-white dark:bg-[#0a3553] hover:shadow-lg dark:hover:shadow-[#042439]/50 transition-shadow'
  };

  return (
    <div className={`rounded-lg ${variants[variant]} ${className}`}>
      {(title || subtitle || action || Icon) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {action && (
              <div className="flex-shrink-0">{action}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

Card.Section = function CardSection({ children, className = '' }) {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-[#042439] rounded-b-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;

// Example usage:
// import { FaGraduationCap } from 'react-icons/fa';
// 
// <Card
//   title="Course Statistics"
//   subtitle="Monthly overview"
//   icon={FaGraduationCap}
//   action={<Button size="sm">View All</Button>}
//   variant="hover"
// >
//   <p>Content goes here</p>
//   <Card.Section>
//     Additional section
//   </Card.Section>
//   <Card.Footer>
//     Footer content
//   </Card.Footer>
// </Card>