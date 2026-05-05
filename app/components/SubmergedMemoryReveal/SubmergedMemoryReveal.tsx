'use client';

import { useEffect, useState } from 'react';
import styles from './SubmergedMemoryReveal.module.css';

export default function SubmergedMemoryReveal({ lines }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    let delay = 0;

    lines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
      }, delay);

      delay += 1800 + Math.random() * 600; 
    });
  }, [lines]);

  return (
    <div className={styles.container}>
      {visibleLines.map((line, i) => (
        <div key={i} className={styles.line}>
          {line}
        </div>
      ))}
    </div>
  );
}
