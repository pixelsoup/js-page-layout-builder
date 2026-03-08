/**
 * Debug utilities
 */

export function debugSortableStatus() {
  console.group('🔍 Sortable Debug Info');
  
  console.log('✓ Sortable available?', typeof Sortable !== 'undefined');
  
  ['js-column1', 'js-column2', 'js-column3', 'js-column4'].forEach(colId => {
    const col = document.getElementById(colId);
    if (col) {
      const wrappers = col.querySelectorAll('.js-component-item-wrapper');
      const handles = col.querySelectorAll('.js-component-item-header-name');
      
      console.log(`${colId}:`, {
        exists: true,
        totalChildren: col.children.length,
        componentItems: wrappers.length,
        dragHandles: handles.length,
        dataIds: Array.from(wrappers).map(el => el.dataset.id),
        handlesCursorStyle: handles.length > 0 ? getComputedStyle(handles[0]).cursor : 'N/A'
      });
      
      // Check if each wrapper has a handle
      wrappers.forEach((wrapper, idx) => {
        const handle = wrapper.querySelector('.js-component-item-header-name');
        if (!handle) {
          console.warn(`  ⚠️  Component ${idx} missing drag handle!`);
        }
      });
    } else {
      console.error(`${colId}: NOT FOUND`);
    }
  });
  
  console.groupEnd();
}

export function testDragSetup() {
  console.group('🧪 Testing Drag Setup');
  
  const col2 = document.getElementById('js-column2');
  const col3 = document.getElementById('js-column3');
  
  if (col2 && col3) {
    const items2 = col2.querySelectorAll('.js-component-item-wrapper');
    const items3 = col3.querySelectorAll('.js-component-item-wrapper');
    
    console.log(`Column 2 (js-column2): ${items2.length} items`);
    console.log(`Column 3 (js-column3): ${items3.length} items`);
    
    if (items2.length > 0) {
      const firstItem = items2[0];
      const handle = firstItem.querySelector('.js-component-item-header-name');
      console.log('First item in Column 2:', {
        id: firstItem.id,
        dataId: firstItem.dataset.id,
        className: firstItem.className,
        draggable: firstItem.draggable,
        hasHandle: !!handle,
        handleCursor: handle ? getComputedStyle(handle).cursor : 'N/A'
      });
      
      console.log('Try dragging the first item in Column 2 to Column 3');
      console.log('Grab handle should have cursor: grab (or cursor: -webkit-grab)');
    } else {
      console.log('⚠️  No items in Column 2. Add some components first.');
    }
  }
  
  console.groupEnd();
}

// Make available globally for testing
window.debugSortableStatus = debugSortableStatus;
window.testDragSetup = testDragSetup;
