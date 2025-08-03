import React from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Box 
} from '@mui/material';

const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [],
  multiline = false,
  rows = 4,
  fullWidth = true,
  ...props
}) => {
  const hasError = Boolean(error);

  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(name, newValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(name);
    }
  };

  if (type === 'select') {
    return (
      <FormControl fullWidth={fullWidth} error={hasError} disabled={disabled}>
        <InputLabel>{label}{required && ' *'}</InputLabel>
        <Select
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label={label + (required ? ' *' : '')}
          {...props}
        >
          {options.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(hasError || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      error={hasError}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      {...props}
    />
  );
};

export default FormField;
