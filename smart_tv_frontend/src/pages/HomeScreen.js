import React from 'react';
import { ContentCarousel } from '../components/ContentCarousel';

// PUBLIC_INTERFACE
export default function HomeScreen() {
  /** Home page with one or more carousels */
  return (
    <div>
      <ContentCarousel title="Featured" idPrefix="featured" />
      <ContentCarousel title="Continue Watching" idPrefix="continue" />
    </div>
  );
}
