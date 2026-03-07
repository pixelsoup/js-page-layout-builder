// Store sortable instances to prevent duplicates
const sortableInstances = new Map();

/**
 * Initialize Sortable.js for all columns
 * This must be called after DOM is ready and after rendering instances
 */
export function initializeSortable() {
  // Check if Sortable is available
  if (typeof Sortable === 'undefined') {
    console.error('Sortable.js is not loaded yet');
    return;
  }
  
  // Update positions helper
  function updatePositions(column) {
    Array.from(column.children).forEach((child, idx) => {
      child.dataset.position = idx;
    });
  }

  // Create Sortable instances for each column
  ['js-column1', 'js-column2', 'js-column3', 'js-column4'].forEach(colId => {
    const col = document.getElementById(colId);
    if (!col) {
      console.warn(`Column ${colId} not found`);
      return;
    }
    
    // Destroy existing instance if it exists
    if (sortableInstances.has(colId)) {
      try {
        sortableInstances.get(colId).destroy();
      } catch (e) {
        console.warn('Failed to destroy sortable instance:', e);
      }
    }
    const columnNumber = colId === 'js-column1' ? 1 : colId === 'js-column2' ? 2 : colId === 'js-column3' ? 3 : 4;
    
    // Enable drag-between-columns for Row 2 (columns 2 and 3)
    const groupOption = (colId === 'js-column2' || colId === 'js-column3') ? 'row2-columns' : false;
    
    console.log(`Initializing Sortable for ${colId} with group:`, groupOption);
    console.log('  - Has componentItemWrapper elements:', col.querySelectorAll('.componentItemWrapper').length);
    console.log('  - Has componentItemHeaderName handles:', col.querySelectorAll('.componentItemHeaderName').length);
    
    const sortableInstance = Sortable.create(col, {
      group: groupOption,
      animation: 150,
      handle: '.componentItemHeaderName',
      draggable: '.componentItemWrapper',
      dataIdAttr: 'data-id',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      filter: '.emptyState',
      onStart: function(evt) {
        console.log('🎯 Drag started on', colId);
        // Add dragging class to all columns in the same group
        if (groupOption) {
          document.querySelectorAll('#js-column2, #js-column3').forEach(c => {
            c.classList.add('sortable-drag-active');
          });
        }
      },
      onEnd: function (evt) {
        console.log('🎯 Drag ended. From:', evt.from.id, 'To:', evt.to.id);
        // Remove dragging class
        document.querySelectorAll('.sortable-drag-active').forEach(c => {
          c.classList.remove('sortable-drag-active');
        });
        
        // Use evt.to (destination column) not col (source column)
        const destinationCol = evt.to;
        updatePositions(destinationCol);
        
        // Get the destination column number
        const destColId = destinationCol.id;
        const destColumnNumber = destColId === 'js-column1' ? 1 : 
                                  destColId === 'js-column2' ? 2 : 
                                  destColId === 'js-column3' ? 3 : 4;
        
        // Get the new order using data-id (instanceId)
        const order = Array.from(destinationCol.children)
          .filter(child => child.classList.contains('componentItemWrapper'))
          .map(child => child.dataset.id);
        
        console.log('New order in column', destColumnNumber, ':', order);
        
        // Dispatch custom event with the new order for the destination column
        const event = new CustomEvent('componentOrderChanged', {
          detail: {
            column: destColumnNumber,
            order: order
          }
        });
        window.dispatchEvent(event);
      }
    });
    
    // Store the instance
    if (sortableInstance) {
      sortableInstances.set(colId, sortableInstance);
      console.log(`✓ Sortable instance created and stored for ${colId}`);
    } else {
      console.error(`✗ Failed to create Sortable instance for ${colId}`);
    }
  });
  
  console.log('Total Sortable instances:', sortableInstances.size);
}
