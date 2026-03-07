import { column_two_id, column_three_id } from './config.js';
import { updateComponentOrder, reindexColumn } from './data-model.js';

/**
 * Initialize sortable event listener
 */
export function initSortableListener() {
  // Listen for custom event from SortableJS, update instance order
  window.addEventListener('componentOrderChanged', event => {
    const detail = event.detail;
    console.log('📦 componentOrderChanged event received:', detail);

    if (detail.isCrossColumnMove) {
      // Cross-column move: update both source and destination
      console.log('  → Cross-column move detected');
      console.log('  → Source column', detail.sourceColumn, ':', detail.sourceOrder);
      console.log('  → Dest column', detail.destColumn, ':', detail.destOrder);
      
      // Update both columns
      updateComponentOrder(detail.sourceColumn, detail.sourceOrder);
      updateComponentOrder(detail.destColumn, detail.destOrder);
    } else {
      // Same-column reorder
      console.log('  → Same-column reorder');
      updateComponentOrder(detail.column, detail.order);
      
      // Re-index other columns in case there are gaps
      [1, column_two_id, column_three_id, 4].forEach(col => {
        if (col !== detail.column) {
          reindexColumn(col);
        }
      });
    }
    
    // DON'T render after drag - Sortable already moved the DOM correctly!
    console.log('✓ Data model updated after drag. DOM already correct (Sortable handled it).');
  });
}
