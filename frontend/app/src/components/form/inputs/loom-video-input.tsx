import React from 'react';
import type { Props } from './propsType';
import LoomViewerRecorder from '../../../people/utils/loomViewerRecorder';

export default function LoomVideoInput({ value, handleChange, handleBlur, handleFocus }: Props) {
  return (
    <LoomViewerRecorder
      name="loomVideo"
      onChange={(e) => {
        handleChange(e);
      }}
      loomEmbedUrl={value}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={{ marginBottom: 10 }}
    />
  );
}
