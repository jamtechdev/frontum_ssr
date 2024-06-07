import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
const ToggleSwitch = () => {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleSwitchChange = () => {
      setIsChecked(!isChecked);
    };
  
    return (
      <Form>
        <Form.Check
        className="custom-switch"
          type="switch"
          id="custom-switch"
          checked={isChecked}
          onChange={handleSwitchChange}
        />
      </Form>
    );
  };
  export default ToggleSwitch;
  
  
  
  