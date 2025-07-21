import React from 'react';

const Slider = (props) => {
  return (
    <input
      type="range"
      {...props}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-4
                 [&::-webkit-slider-thumb]:h-4
                 [&::-webkit-slider-thumb]:bg-cyan-400
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-moz-range-thumb]:w-4
                 [&::-moz-range-thumb]:h-4
                 [&::-moz-range-thumb]:bg-cyan-400
                 [&::-moz-range-thumb]:rounded-full
                 [&::-moz-range-thumb]:cursor-pointer
                 [&::-moz-range-thumb]:border-0
                 "
    />
  );
};

export default Slider;
