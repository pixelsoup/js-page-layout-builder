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

  // Shared group configuration for Row 2 columns
  const row2GroupConfig = {
    name: 'row2-columns',
    put: true,
    pull: true
  };

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
    const isRow2Column = (colId === 'js-column2' || colId === 'js-column3');

    console.log(`Initializing Sortable for ${colId}, isRow2Column:`, isRow2Column);
    console.log('  - Has componentItemWrapper elements:', col.querySelectorAll('.js-component-item-wrapper').length);
    console.log('  - Has componentItemHeaderName handles:', col.querySelectorAll('.js-component-item-header-name').length);

    const sortableConfig = {
      animation: 150,
      handle: '.js-component-item-header-name',
      draggable: '.js-component-item-wrapper',
      dataIdAttr: 'data-id',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      emptyInsertThreshold: 100,  // Allow drops in empty columns (100px detection area)
      fallbackOnBody: true,
      swapThreshold: 0.65,
      sort: true,
      onStart: function(evt) {
        console.log('🎯 Drag started on', colId, '- Item:', evt.item.dataset.id);

        // Remove all empty states during drag to allow drops anywhere
        document.querySelectorAll('.js-empty-state-wrapper').forEach(es => {
          es.dataset.parentId = es.parentElement.id;  // Store parent for restoration
          es.remove();
        });

        // Add dragging class to all columns in the same group
        if (isRow2Column) {
          document.querySelectorAll('#js-column2, #js-column3').forEach(c => {
            c.classList.add('sortable-drag-active');
          });
        }
      },
      onMove: function(evt) {
        // Log attempted cross-column moves
        if (evt.from.id !== evt.to.id) {
          console.log('  → Attempting move from', evt.from.id, 'to', evt.to.id);
        }
        // Explicitly allow the move
        return true;
      },
      onEnd: function (evt) {
        const sourceCol = evt.from;
        const destinationCol = evt.item.parentElement;  // Use actual parent, not evt.to
        const isCrossColumnMove = sourceCol.id !== destinationCol.id;

        console.log('🎯 Drag ended. From:', sourceCol.id, 'To:', destinationCol.id, '- Cross-column:', isCrossColumnMove);

        // Restore empty states only for columns that have no components
        document.querySelectorAll('.js-body-column-target-wrapper').forEach(colEl => {
          const componentItems = colEl.querySelectorAll('.js-component-item-wrapper');
          const hasEmptyState = colEl.querySelector('.js-empty-state-wrapper');

          if (componentItems.length === 0 && !hasEmptyState) {
            // Column is empty and needs an empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'lb-empty-state-wrapper js-empty-state-wrapper';
            emptyState.innerHTML = `
              <svg class="lb-empty-state-icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <p class="lb-empty-state-text">Drop components here</p>
            `;
            colEl.appendChild(emptyState);
          } else if (componentItems.length > 0 && hasEmptyState) {
            // Column has items, remove empty state if it exists
            hasEmptyState.remove();
          }
        });

        // Remove dragging class
        document.querySelectorAll('.sortable-drag-active').forEach(c => {
          c.classList.remove('sortable-drag-active');
        });

        // Update positions for destination column
        updatePositions(destinationCol);

        // Get the destination column number and order
        const destColId = destinationCol.id;
        const destColumnNumber = destColId === 'js-column1' ? 1 :
                                  destColId === 'js-column2' ? 2 :
                                  destColId === 'js-column3' ? 3 : 4;

        const destOrder = Array.from(destinationCol.children)
          .filter(child => child.classList.contains('lb-component-item-wrapper'))
          .map(child => child.dataset.id);

        console.log('New order in column', destColumnNumber, ':', destOrder);

        // For cross-column moves, we need to update both columns at once
        if (isCrossColumnMove) {
          updatePositions(sourceCol);

          const sourceColId = sourceCol.id;
          const sourceColumnNumber = sourceColId === 'js-column1' ? 1 :
                                      sourceColId === 'js-column2' ? 2 :
                                      sourceColId === 'js-column3' ? 3 : 4;

          const sourceOrder = Array.from(sourceCol.children)
            .filter(child => child.classList.contains('lb-component-item-wrapper'))
            .map(child => child.dataset.id);

          console.log('Source column', sourceColumnNumber, 'new order:', sourceOrder);

          // Dispatch a single event with both columns' data
          window.dispatchEvent(new CustomEvent('componentOrderChanged', {
            detail: {
              isCrossColumnMove: true,
              sourceColumn: sourceColumnNumber,
              sourceOrder: sourceOrder,
              destColumn: destColumnNumber,
              destOrder: destOrder
            }
          }));
        } else {
          // Same-column reorder
          window.dispatchEvent(new CustomEvent('componentOrderChanged', {
            detail: {
              isCrossColumnMove: false,
              column: destColumnNumber,
              order: destOrder
            }
          }));
        }
      }
    };

    // Add group option if this is a Row 2 column
    if (isRow2Column) {
      sortableConfig.group = row2GroupConfig;
      console.log('  ✓ Added group for cross-column dragging:', sortableConfig.group);
    }

    const sortableInstance = Sortable.create(col, sortableConfig);

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
