import React from 'react';

const Loading = () => {
  const delays = [0, 200, 300, 400]; // in milliseconds

  return (
    <div className="flex items-center justify-center gap-2 h-screen">
      {delays.map((delay, index) => (
        <div
          key={index}
          className="animate-bounce rounded-full h-6 w-6 border-2 bg-primary border-primary-dull"
          style={{ animationDelay: `${delay}ms` }}
        ></div>
      ))}
    </div>
  );
};

export default Loading;
