import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * A reusable toggle switch component.
 */
export const Switch = ({ checked, onCheckedChange, disabled, className, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={classNames(
        'relative inline-flex h-6 w-12 rounded-full transition-colors focus:outline-none',
        checked ? 'bg-blue-500' : 'bg-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      {...props}
    >
      <span
        className={classNames(
          'absolute h-5 w-5 rounded-full bg-white shadow transform transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool.isRequired, // Whether the switch is on or off
  onCheckedChange: PropTypes.func.isRequired, // Callback when the switch changes state
  disabled: PropTypes.bool, // Whether the switch is disabled
  className: PropTypes.string // Additional class names
};

Switch.defaultProps = {
  disabled: false,
  className: ''
};

export default Switch;
