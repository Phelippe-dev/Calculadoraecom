import React from 'react';

export default function FormattedInput({
  id,
  value,
  onChange,
  placeholder = '',
  type = 'currency',
  prefix,
  suffix,
  disabled = false,
  style = {}
}) {
  const handleFocus = (e) => {
    e.target.select();
  };

  const handleChange = (e) => {
    let raw = e.target.value;

    if (type === 'currency' || type === 'decimal') {
      // Allow numbers, comma, period
      raw = raw.replace(/[^\d.,]/g, '');
    }

    onChange({
      target: {
        id,
        name: id,
        value: raw
      }
    });
  };

  const defaultPrefix = prefix ?? (type === 'currency' ? 'R$' : null);
  const defaultSuffix = suffix ?? (type === 'decimal' ? '%' : null);

  return (
    <div className="formatted-input-wrapper" style={style}>
      {defaultPrefix && <span className="input-prefix">{defaultPrefix}</span>}
      <input
        type="text"
        inputMode={type === 'text' ? 'text' : 'decimal'}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="formatted-input-field"
      />
      {defaultSuffix && <span className="input-suffix">{defaultSuffix}</span>}
    </div>
  );
}
