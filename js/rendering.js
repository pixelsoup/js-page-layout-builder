import {
  componentCatalog,
  main_tabs_panel,
  column_one,
  column_two,
  column_three,
  column_four,
  component_add_button_id_prefix,
  component_item_id_prefix,
  component_item_wrapper_class,
  visibility_selector_id_prefix,
  column_two_id,
  column_three_id
} from './config.js';

import {
  getComponentType,
  getInstancesByType,
  get_sorted_instances,
  addComponentInstance,
  componentInstances
} from './data-model.js';

// Will be set by main.js to avoid circular dependency
let initializeSortable = null;

export function setSortableInitializer(fn) {
  initializeSortable = fn;
}

// Event handler attachers will be imported dynamically to avoid circular deps
let attachInfoButtonEvent, attachDuplicateButtonEvent, attach_component_events;

export function setEventHandlers(handlers) {
  attachInfoButtonEvent = handlers.attachInfoButtonEvent;
  attachDuplicateButtonEvent = handlers.attachDuplicateButtonEvent;
  attach_component_events = handlers.attach_component_events;
}

/**
 * Check if a component's eligible columns include the active tab (column)
 * @param {number|number[]} column - Column value (number or array)
 * @param {number} active_tab - Active tab number (1-4, equals column number)
 * @returns {boolean}
 */
function columnMatchesActiveTab(column, active_tab) {
  if (Array.isArray(column)) {
    return column.includes(active_tab);
  }
  return column === active_tab;
}

/**
 * Get CSS classes for component button based on eligible column(s)
 * @param {number|number[]} column - Column value (number or array)
 * @returns {string} CSS classes
 */
function getColumnClasses(column) {
  if (Array.isArray(column)) {
    return column.map(c => `btn-col${c}`).join(' ');
  }
  return `btn-col${column}`;
}

/**
 * Get visibility badge text
 * @param {boolean} hideOnMobile
 * @param {boolean} hideOnDesktop
 * @returns {string}
 */
function getVisibilityBadge(hideOnMobile, hideOnDesktop) {
  if (hideOnMobile && !hideOnDesktop) {
    return '<span class="lb-component-visibility-badge visibility-badge-desktop">Desktop only</span>';
  } else if (!hideOnMobile && hideOnDesktop) {
    return '<span class="lb-component-visibility-badge visibility-badge-mobile">Mobile only</span>';
  }
  return '';
}

/**
 * Create component button inner content HTML (text, count, and SVG icon)
 * @param {object} compType - Component type from catalog
 * @param {number} instanceCount - Number of instances of this type
 * @returns {string} HTML string for button inner content
 */
function createComponentButtonContentHTML(compType, instanceCount) {
  const countLabel = instanceCount > 0 ? ` (${instanceCount})` : '';
  return `${compType.name}${countLabel} <svg class="icon-svg icon-aside-component-add"><use xlink:href="#svg-circle-plus"></use></svg>`;
}

/**
 * Create component button HTML (full button element)
 * @param {object} compType - Component type from catalog
 * @param {number} instanceCount - Number of instances of this type
 * @returns {string} HTML string for button
 */
function createComponentButtonHTML(compType, instanceCount) {
  const countLabel = instanceCount > 0 ? ` (${instanceCount})` : '';
  const columnClasses = getColumnClasses(compType.column);
  const content = createComponentButtonContentHTML(compType, instanceCount);
  return `<button id="${component_add_button_id_prefix}${compType.typeId}" class="lb-aside-tabs-pane-btn ${columnClasses}" title="Add ${compType.name} component" data-type-id="${compType.typeId}">${content}</button>`;
}

/**
 * Create empty state HTML
 * @returns {string} HTML string for empty state
 */
function createEmptyStateHTML() {
  return `<div class="lb-empty-state-wrapper js-empty-state-wrapper"><svg class="icon-lb-empty-state" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><p class="lb-empty-state-text">No components yet</p></div>`;
}

/**
 * Create visibility selector HTML
 * @param {string} instanceId - Component instance ID
 * @param {string} visibilityValue - 'both', 'desktop', or 'mobile'
 * @returns {string} HTML string for visibility selector
 */
function createVisibilitySelectorHTML(instanceId, visibilityValue) {
  return `<select id="${visibility_selector_id_prefix}-${instanceId}" class="lb-component-visibility-select js-component-visibility-select" title="Visibility"><option value="both" ${visibilityValue === 'both' ? 'selected' : ''}>Both</option><option value="desktop" ${visibilityValue === 'desktop' ? 'selected' : ''}>Desktop only</option><option value="mobile" ${visibilityValue === 'mobile' ? 'selected' : ''}>Mobile only</option></select>`;
}

/**
 * Create component item HTML
 * @param {object} instance - Component instance
 * @param {object} compType - Component type from catalog
 * @returns {string} HTML string for component item
 */
function createComponentItemHTML(instance, compType) {
  // Visibility dropdown
  let visibilityValue = 'both';
  if (instance.hideOnMobile && !instance.hideOnDesktop) visibilityValue = 'desktop';
  else if (!instance.hideOnMobile && instance.hideOnDesktop) visibilityValue = 'mobile';

  const visibility_selector = createVisibilitySelectorHTML(instance.instanceId, visibilityValue);
  const visibilityBadge = getVisibilityBadge(instance.hideOnMobile, instance.hideOnDesktop);

  return `<div class="lb-component-item-header-name js-component-item-header-name" title="Drag to reorder"><svg class="lg-icon icon-component-grabber"><use xlink:href="#svg-grabber"></use></svg>${compType.name}${visibilityBadge}</div><div class="lb-component-triggers-wrapper"><button id="js-component-btn-info-${instance.instanceId}" class="lb-component-trigger-btn btn-info" title="Component info"><svg class="icon-component-trigger icon-info"><use xlink:href="#svg-info-circle"></use></svg></button>${visibility_selector}<div class="lb-component-trigger-btns-wrapper"><button id="js-component-btn-duplicate-${instance.instanceId}" class="lb-component-trigger-btn btn-duplicate" title="Duplicate component"><svg class="icon-component-trigger icon-duplicate"><use xlink:href="#svg-duplicate"></use></svg></button><button class="lb-component-trigger-btn btn-delete js-btn-delete" data-instance-id="${instance.instanceId}" title="Delete component"><svg class="icon-component-trigger icon-delete"><use xlink:href="#svg-trash"></use></svg></button></div></div>`;
}

/**
 * Get column element by column ID
 * @param {number} column_id - Column ID (1, 2, 3, or 4)
 * @returns {HTMLElement|null} Column element or null
 */
function getColumnElement(column_id) {
  const columnMap = {
    1: column_one,
    [column_two_id]: column_two,
    [column_three_id]: column_three,
    4: column_four
  };
  return columnMap[column_id] || null;
}

/**
 * Renders all "add component" buttons for the current tab (column).
 * Toggles visibility of buttons based on the currently selected tab (tab number = column number).
 * @param {number} [active_tab=1] - The currently active tab (1-4, equals target column number).
 */
export function render_component_buttons(active_tab = 1) {
  // Store the active tab (column) so the click handler can access it
  main_tabs_panel.dataset.activeTab = active_tab.toString();

  // Only render buttons once
  if (!main_tabs_panel.dataset.initialized) {
    const buttonsHTML = componentCatalog.map(compType => {
      const instanceCount = getInstancesByType(compType.typeId).length;
      return createComponentButtonHTML(compType, instanceCount);
    }).join('');
    
    main_tabs_panel.innerHTML = buttonsHTML;
    main_tabs_panel.dataset.initialized = 'true';

    // Set up event delegation for button clicks (activeTab = target column)
    main_tabs_panel.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-type-id]');
      if (button) {
        const typeId = parseInt(button.dataset.typeId, 10);
        const targetColumn = parseInt(main_tabs_panel.dataset.activeTab || '1', 10);
        addComponentInstance(typeId, targetColumn);
        render_component_items();
        update_button_states();
      }
    });
  }

  // Toggle button visibility based on active tab (column)
  componentCatalog.forEach(compType => {
    const button = document.getElementById(`${component_add_button_id_prefix}${compType.typeId}`);
    if (button) {
      if (columnMatchesActiveTab(compType.column, active_tab)) {
        button.classList.remove('hidden');
      } else {
        button.classList.add('hidden');
      }
    }
  });

  update_button_states();
}

/**
 * Updates the enabled/disabled state of all component add buttons.
 * Shows count of instances for each type.
 */
export function update_button_states() {
  componentCatalog.forEach(compType => {
    const add_button = document.getElementById(`${component_add_button_id_prefix}${compType.typeId}`);
    if (add_button) {
      const instanceCount = getInstancesByType(compType.typeId).length;
      add_button.innerHTML = createComponentButtonContentHTML(compType, instanceCount);
    }
  });
}

/**
 * Renders all instances into their respective columns.
 * Maintains order and renders UI for each instance in its assigned column.
 */
export function render_component_items() {
  // Clear all columns
  [column_one, column_two, column_three, column_four].forEach(col => col.innerHTML = '');

  // Render each column's instances in the determined order
  [1, column_two_id, column_three_id, 4].forEach(column_id => {
    const elements_container = getColumnElement(column_id);
    if (!elements_container) return;

    const instances = get_sorted_instances(column_id);

    // Empty state
    if (instances.length === 0) {
      elements_container.innerHTML = createEmptyStateHTML();
    }

    instances.forEach((instance, idx) => {
      instance.position = idx;
      const compType = getComponentType(instance.typeId);
      if (!compType) return;

      const component_element = document.createElement('div');
      component_element.id = `${component_item_id_prefix}-${instance.instanceId}`;
      component_element.className = `${component_item_wrapper_class} js-component-item-wrapper`;
      component_element.setAttribute('data-id', instance.instanceId);
      component_element.setAttribute('data-position', instance.position);
      component_element.setAttribute('data-name', compType.componentName);
      component_element.innerHTML = createComponentItemHTML(instance, compType);
      elements_container.appendChild(component_element);

      // Attach event listeners
      attachInfoButtonEvent(instance.instanceId, compType.typeId);
      attachDuplicateButtonEvent(instance.instanceId);
    });
  });

  update_button_states();
  attach_component_events();

  // CRITICAL: Reinitialize Sortable.js after rendering
  // We clear innerHTML, so DOM elements are destroyed and Sortable needs to be reattached
  if (initializeSortable) {
    // Small delay to ensure DOM is fully updated
    setTimeout(() => {
      initializeSortable();
    }, 10);
  }
}
