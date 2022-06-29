import React from 'react';
import { runForceGraph } from './forceGraphGenerator';
import styles from './forceGraph.module.css';

function ForceGraph({ linksData, nodesData } : any) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData);
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData]);

  return <div ref={containerRef} className={styles.container} />;
}

export default ForceGraph