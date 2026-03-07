import { render_component_buttons, render_component_items, setEventHandlers, setSortableInitializer } from './rendering.js';
import { initTabButtons, initColumnClickHandlers } from './tab-manager.js';
import { initDrawerCloseButton, initEscapeKeyHandler, attachInfoButtonEvent, attachDuplicateButtonEvent, attach_component_events } from './event-handlers.js';
import { initCopyConfigButton, initClearAllButton, exportConfiguration, copyConfigToClipboard } from './export.js';
import { initSortableListener } from './sortable-handler.js';
import { initializeSortable } from './sortable-init.js';
import { setComponentInstances } from './data-model.js';
import { loadFromStorage } from './persistence.js';
import { debugSortableStatus } from './debug.js';

/**
 * Initialize the page builder application
 */
function init() {
  // Load saved instances from localStorage
  const savedInstances = loadFromStorage();
  if (savedInstances.length > 0) {
    setComponentInstances(savedInstances);
  }
  
  // Set event handlers in rendering module to avoid circular dependency
  setEventHandlers({ attachInfoButtonEvent, attachDuplicateButtonEvent, attach_component_events });
  
  // Set sortable initializer in rendering module to avoid circular dependency
  setSortableInitializer(initializeSortable);
  
  // Initialize tab functionality
  initTabButtons();
  
  // Initialize column click handlers
  initColumnClickHandlers();
  
  // Initialize drawer controls
  initDrawerCloseButton();
  initEscapeKeyHandler();
  
  // Initialize export functionality
  initCopyConfigButton();
  initClearAllButton();
  
  // Initialize sortable listener
  initSortableListener();
  
  // Initial render
  render_component_buttons(1);
  render_component_items();
  
  // Sortable is automatically initialized by render_component_items()
  // Debug info after initialization
  setTimeout(() => {
    debugSortableStatus();
  }, 150);
  
  // Log configuration on load for testing
  console.log('Page builder loaded. Use exportConfiguration() or copyConfigToClipboard() to export configuration.');
  console.log('Use debugSortableStatus() to check drag-and-drop setup');
}

// Make export functions available globally for testing
window.exportConfiguration = exportConfiguration;
window.copyConfigToClipboard = copyConfigToClipboard;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
