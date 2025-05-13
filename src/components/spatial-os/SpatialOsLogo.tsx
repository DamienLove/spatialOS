import type React from 'react';

interface SpatialOsLogoProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific props for the logo if needed
}

const SpatialOsLogo: React.FC<SpatialOsLogoProps> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10.0002 20C11.1048 20 12.0002 19.1046 12.0002 18C12.0002 16.8954 11.1048 16 10.0002 16C8.8956 16 8.00019 16.8954 8.00019 18C8.00019 19.1046 8.8956 20 10.0002 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.0002 8.00001C15.1048 8.00001 16.0002 7.10458 16.0002 6.00001C16.0002 4.89544 15.1048 4.00001 14.0002 4.00001C12.8956 4.00001 12.0002 4.89544 12.0002 6.00001C12.0002 7.10458 12.8956 8.00001 14.0002 8.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default SpatialOsLogo;
