import React, { useState } from 'react';

// Simple test input component to debug the input issue
function TestInput() {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    console.log('TestInput change:', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div style={{ padding: '20px', background: '#333', color: 'white' }}>
      <h3>Test Input Component</h3>
      <label>
        Test Input (should accept multiple characters):
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Type something here..."
          style={{
            margin: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: 'white',
            color: 'black'
          }}
        />
      </label>
      <p>Current value: "{value}"</p>
      <p>Value length: {value.length}</p>
    </div>
  );
}

export default TestInput;
