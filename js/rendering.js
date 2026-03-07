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
  column_selector_id_prefix,
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
 * Get visibility badge text
 * @param {boolean} hideOnMobile
 * @param {boolean} hideOnDesktop
 * @returns {string}
 */
function getVisibilityBadge(hideOnMobile, hideOnDesktop) {
  if (hideOnMobile && !hideOnDesktop) {
    return '<span class="visibilityBadge visibilityBadge--desktop">Desktop only</span>';
  } else if (!hideOnMobile && hideOnDesktop) {
    return '<span class="visibilityBadge visibilityBadge--mobile">Mobile only</span>';
  }
  return '';
}

/**
 * Renders all "add component" buttons for the current tab, following the row structure.
 * Toggles visibility of buttons based on the currently selected tab.
 * @param {number} [active_tab=1] - The currently active tab row.
 */
export function render_component_buttons(active_tab = 1) {
  // Only render buttons once
  if (!main_tabs_panel.dataset.initialized) {
    componentCatalog.forEach(compType => {
      const button = document.createElement('button');
      button.id = `${component_add_button_id_prefix}${compType.typeId}`;
      button.className = `componentBtn componentBtn-row${compType.row}`;
      button.setAttribute('title', `Add ${compType.name} component`);
      
      const instanceCount = getInstancesByType(compType.typeId).length;
      const countLabel = instanceCount > 0 ? ` (${instanceCount})` : '';
      button.innerHTML = `${compType.name}${countLabel} <span class="icon-trigger icon-add">+</span>`;

      button.onclick = () => {
        addComponentInstance(compType.typeId);
        render_component_items();
        update_button_states();
      };
      main_tabs_panel.appendChild(button);
    });
    main_tabs_panel.dataset.initialized = 'true';
  }

  // Toggle button visibility based on active tab
  componentCatalog.forEach(compType => {
    const button = document.getElementById(`${component_add_button_id_prefix}${compType.typeId}`);
    if (button) {
      if (compType.row === active_tab) {
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
      const countLabel = instanceCount > 0 ? ` (${instanceCount})` : '';
      add_button.innerHTML = `${compType.name}${countLabel} <span class="icon-trigger icon-add">+</span>`;
    }
  });
}

/**
 * Renders all instances into their respective columns.
 * Maintains order and renders UI for each instance in its assigned column.
 */
export function render_component_items() {
  column_one.innerHTML = '';
  column_two.innerHTML = '';
  column_three.innerHTML = '';
  column_four.innerHTML = '';

  // Render each column's instances in the determined order
  [1, column_two_id, column_three_id, 4].forEach(column_id => {
    const elements_container = column_id === 1 ? column_one :
                              column_id === column_two_id ? column_two :
                              column_id === column_three_id ? column_three : column_four;

    const instances = get_sorted_instances(column_id);
    
    // Empty state
    if (instances.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'emptyState';
      emptyState.innerHTML = `
        <svg class="emptyState__icon" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <p class="emptyState__text">Drop components here</p>
      `;
      elements_container.appendChild(emptyState);
    }

    instances.forEach((instance, idx) => {
      instance.position = idx;
      const compType = getComponentType(instance.typeId);
      if (!compType) return;

      const component_element = document.createElement('div');
      component_element.id = `${component_item_id_prefix}-${instance.instanceId}`;
      component_element.className = component_item_wrapper_class;
      component_element.dataset.id = instance.instanceId;
      component_element.dataset.position = instance.position;
      component_element.dataset.name = compType.componentName;

      // Column 2 and 3 have a column selector; others do not
      const column_selector = (column_id === column_two_id || column_id === column_three_id) ? `
        <select id="${column_selector_id_prefix}-${instance.instanceId}" class="componentColumnSelector" title="Change column">
          <option value="column2" ${instance.column === column_two_id ? 'selected' : ''}>Column 1</option>
          <option value="column3" ${instance.column === column_three_id ? 'selected' : ''}>Column 2</option>
        </select>
      ` : '';

      // Visibility dropdown
      let visibilityValue = 'both';
      if (instance.hideOnMobile && !instance.hideOnDesktop) visibilityValue = 'desktop';
      else if (!instance.hideOnMobile && instance.hideOnDesktop) visibilityValue = 'mobile';

      const visibility_selector = `
        <select id="${visibility_selector_id_prefix}-${instance.instanceId}" class="componentVisibilitySelector" title="Visibility">
          <option value="both" ${visibilityValue === 'both' ? 'selected' : ''}>Both</option>
          <option value="desktop" ${visibilityValue === 'desktop' ? 'selected' : ''}>Desktop only</option>
          <option value="mobile" ${visibilityValue === 'mobile' ? 'selected' : ''}>Mobile only</option>
        </select>
      `;

      const visibilityBadge = getVisibilityBadge(instance.hideOnMobile, instance.hideOnDesktop);

      component_element.innerHTML = `
        <div class="componentItemHeaderName" title="Drag to reorder">
          <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
          ${compType.name}
          ${visibilityBadge}
        </div>
        <div class="componentItemTriggersWrapper">
          <button id="js-component-btn-info-${instance.instanceId}" class="btn-info-wrapper" title="Component info">
            <svg class="icon-trigger icon-info"><use xlink:href="#svg-info-circle"></use></svg>
          </button>
          ${visibility_selector}
          ${column_selector}
          <button id="js-component-btn-duplicate-${instance.instanceId}" class="btn-duplicate-wrapper" title="Duplicate component">
            <svg class="icon-trigger icon-duplicate" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <button class="btn-delete-wrapper icon-trigger icon-delete" data-instance-id="${instance.instanceId}" title="Delete component">&ndash;</button>
        </div>
      `;
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
