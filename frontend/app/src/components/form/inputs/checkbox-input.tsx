import React, { useEffect } from 'react';
import { EuiCheckbox } from '@elastic/eui';
import type { Props } from './propsType';
import { Note } from './index';
import { colors } from '../../../config/colors';

export default function CheckBox({
  note,
  value,
  name,
  handleChange,
  handleBlur,
  handleFocus
}: Props) {
  const color = colors['light'];
  useEffect(() => {
    // if value not initiated, default value true
    if (name === 'show' && value === undefined) handleChange(true);
  }, []);

  return (
    <>
      <EuiCheckbox
        id="hi"
        label=""
        checked={value}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        onBlur={handleBlur}
        onFocus={handleFocus}
        compressed
      />
      {note && <Note color={color}>*{note}</Note>}
    </>
  );
}
