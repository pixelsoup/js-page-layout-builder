import { column_two_id, column_three_id } from './config.js';
import { updateComponentOrder, reindexColumn } from './data-model.js';

/**
 * Initialize sortable event listener
 */
export function initSortableListener() {
  // Listen for custom event from SortableJS, update instance order
  window.addEventListener('componentOrderChanged', event => {
    const { column, order } = event.detail;
    console.log('📦 componentOrderChanged event received:', { column, order });

    // Update column and positions for all instances in the order
    updateComponentOrder(column, order);
    
    // Re-index other columns in case items were moved out
    [1, column_two_id, column_three_id, 4].forEach(col => {
      if (col !== column) {
        reindexColumn(col);
      }
    });
    
    // DON'T render after drag - Sortable already moved the DOM correctly!
    // Just update button states to reflect new instance counts
    console.log('✓ Data model updated after drag. DOM already correct (Sortable handled it).');
  });
}
