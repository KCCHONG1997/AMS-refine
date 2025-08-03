import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageLayout.css';

const Breadcrumb = ({ paths, extraClass = '' }) => {
  return (
    <div className={`breadcrumb ${extraClass}`}>
      {paths.map((path, index) => (
        <span key={index}>
          {path.to ? (
            <Link to={path.to}>{path.label}</Link>
          ) : (
            <span>{path.label}</span>
          )}
          {index < paths.length - 1 && ' > '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;