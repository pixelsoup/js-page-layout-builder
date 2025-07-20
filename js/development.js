// DOM elements
const main_tabs_panel = document.getElementById('js-componentTabPanels');
const column_one = document.querySelector('#js-column1');
const column_two = document.querySelector('#js-column2');
const column_three = document.querySelector('#js-column3');
const column_four = document.querySelector('#js-column4');
const tab_buttons = document.querySelectorAll('.componentsTab');

// Prefixes and class names for DOM structure and styling
const component_add_button_id_prefix = 'js-componentBtn';
const component_item_id_prefix = 'js-component';
const component_item_wrapper_class = 'componentItemWrapper';
const column_selector_id_prefix = 'js-colSelector';

// Column identifiers (as referenced in the data model)
const column_two_id = 2;
const column_three_id = 3;

// Fetch fade transition duration from CSS variable, default to 300ms
const fadeTransitionDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fadeTransitionDuration'), 10) || 300;

// Single source of truth for all available components
const components = [
  { id: 1, componentName: 'heading', name: 'Heading', active: false, column: null, row: 1 },
  { id: 2, componentName: 'price', name: 'Price', active: false, column: null, row: 1 },
  { id: 3, componentName: 'reserve_now', name: 'Reserve Now', active: false, column: null, row: 1 },
  { id: 4, componentName: 'other', name: 'Other', active: false, column: null, row: 1 },
  { id: 5, componentName: 'image_carousel', name: 'Image Carousel', active: false, column: column_two_id, row: 2 },
  { id: 6, componentName: 'standard_form', name: 'Form', active: false, column: column_two_id, row: 2 },
  { id: 7, componentName: 'ctas', name: 'CTAs', active: false, column: column_two_id, row: 2 },
  { id: 8, componentName: 'key_features', name: 'Key Features', active: false, column: column_two_id, row: 2 },
  { id: 9, componentName: 'dealer_location', name: 'Dealer Location', active: false, column: column_two_id, row: 2 },
  { id: 10, componentName: 'comments', name: 'Comments', active: false, column: column_two_id, row: 2 },
  { id: 11, componentName: 'full_specifications', name: 'Full Specifications', active: false, column: column_two_id, row: 2 },
  { id: 12, componentName: 'disclaimer', name: 'Disclaimer', active: false, column: column_two_id, row: 2 },
  { id: 13, componentName: 'stock_specials', name: 'Stock Specials', active: false, column: column_two_id, row: 2 },
  { id: 14, componentName: 'price_rating', name: 'Price Rating', active: false, column: column_two_id, row: 2 },
  { id: 15, componentName: 'similar_vehicles_carousel', name: 'Similar Vehicles Carousel', active: false, column: null, row: 3 }
];

/**
 * Renders all "add component" buttons for the current tab, following the row structure.
 * Toggles visibility of buttons based on the currently selected tab.
 * @param {number} [active_tab=1] - The currently active tab row.
 */
function render_component_buttons(active_tab = 1) {
  // Only render buttons once
  if (!main_tabs_panel.dataset.initialized) {
    components.forEach(component => {
      const button = document.createElement('button');
      button.id = `${component_add_button_id_prefix}${component.id}`;
      button.className = `componentBtn componentBtn-row${component.row}`;
      button.innerHTML = `${component.name} <span class="icon-trigger icon-add">+</span>`;

      // Assigns column based on row/component and activates the component when clicked
      button.onclick = () => {
        if (button.classList.contains('inactive')) return;
        button.classList.add('fading-out');

        if (component && !component.active) {
          component.active = true;
          // Assign column based on row/component
          if (component.row === 1) component.column = 1;
          else if (component.row === 2) component.column = column_two_id;
          else if (component.row === 3) component.column = 4;
          render_component_items();
        }

        // After animation, set button as inactive
        setTimeout(() => {
          button.classList.remove('fading-out');
          button.classList.add('inactive');
        }, fadeTransitionDuration);
      };
      main_tabs_panel.appendChild(button);
    });
    main_tabs_panel.dataset.initialized = 'true';
  }

  // Toggle button visibility based on active tab
  components.forEach(component => {
    const button = document.getElementById(`${component_add_button_id_prefix}${component.id}`);
    if (button) {
      if (component.row === active_tab) {
        button.classList.remove('hidden');
      } else {
        button.classList.add('hidden');
      }
    }
  });

  update_button_states();
}

// Switches tabs and updates the button panel visibility on click.
tab_buttons.forEach(tab => {
  tab.onclick = () => {
    tab_buttons.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    render_component_buttons(parseInt(tab.dataset.tab, 10));
  };
});

// Initial render
document.querySelector('.componentsTab[data-tab="1"]').classList.add('active');
render_component_buttons(1);

/**
 * Returns active components for the given column, sorted by their position.
 * @param {number} column_id
 * @returns {Array} - Sorted active components
 */
function get_sorted_active_components(column_id) {
  return components.filter(c => c.active && c.column === column_id)
    .sort((a, b) => (a.position || 0) - (b.position || 0));
}

/**
 * Renders all active components into their respective columns.
 * Maintains order and renders UI for each component in its assigned column.
 */
function render_component_items() {
  column_one.innerHTML = '';
  column_two.innerHTML = '';
  column_three.innerHTML = '';
  column_four.innerHTML = '';

  // Render each column's components in the determined order
  [1, column_two_id, column_three_id, 4].forEach(column_id => {
    const elements_container = column_id === 1 ? column_one :
                              column_id === column_two_id ? column_two :
                              column_id === column_three_id ? column_three : column_four;

    get_sorted_active_components(column_id).forEach((component, idx) => {
      component.position = idx;
      const component_element = document.createElement('div');
      component_element.id = `${component_item_id_prefix}${component.id}`;
      component_element.className = component_item_wrapper_class;
      component_element.dataset.position = component.position;
      component_element.dataset.name = component.componentName;

      // Column 2 and 3 have a column selector; others do not
      const column_selector = (column_id === column_two_id || column_id === column_three_id) ? `
        <select id="${column_selector_id_prefix}${component.id}" class="componentColumnSelector">
          <option value="column2" ${component.column === column_two_id ? 'selected' : ''}>Column 1</option>
          <option value="column3" ${component.column === column_three_id ? 'selected' : ''}>Column 2</option>
        </select>
      ` : '';

      component_element.innerHTML = `
        <div class="componentItemHeaderName">
          <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
          ${component.name}
        </div>
        <div class="componentItemTriggersWrapper">
          ${column_selector}
          <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
        </div>
      `;
      elements_container.appendChild(component_element);
    });
  });

  update_button_states();
  attach_component_events();
}

/**
 * Updates the enabled/disabled state of all component add buttons.
 * Re-enables buttons for components that are not currently active.
 */
function update_button_states() {
  components.forEach(component => {
    const add_button = document.getElementById(`${component_add_button_id_prefix}${component.id}`);
    if (add_button && !component.active) {
      add_button.classList.remove('inactive', 'fading-out');
    }
  });
}

/**
 * Attaches event handlers for column selector changes and delete actions.
 * Handles moving components between columns and deleting components.
 */
function attach_component_events() {
  // Column selector change handler
  document.querySelectorAll('.componentColumnSelector').forEach(selector => {
    selector.onchange = () => {
      const component_id = parseInt(selector.id.replace(column_selector_id_prefix, ''), 10);
      const component = components.find(c => c.id === component_id);
      if (component) {
        component.column = selector.value === 'column2' ? column_two_id : column_three_id;
        render_component_items();
      }
    };
  });

  // Delete button handler
  document.querySelectorAll('.icon-delete').forEach(delete_button => {
    delete_button.onclick = () => {
      const component_id = parseInt(delete_button.dataset.id, 10);
      const component = components.find(c => c.id === component_id);
      if (!component || !component.active) return;

      // Re-enable the add button immediately
      const add_button = document.getElementById(`${component_add_button_id_prefix}${component_id}`);
      if (add_button) {
        add_button.classList.remove('inactive', 'fading-out');
      }

      // Start fade-out animation
      const component_element = document.getElementById(`${component_item_id_prefix}${component_id}`);
      if (component_element) {
        component_element.classList.add('fading-out');
      }

      // After animation, deactivate, re-sort, and re-render
      setTimeout(() => {
        component.active = false;
        const active_in_column = components
          .filter(c => c.active && c.column === component.column)
          .sort((a, b) => (a.position || 0) - (b.position || 0));
        // Re-index positions
        active_in_column.forEach((c, i) => { c.position = i; });
        render_component_items();
      }, fadeTransitionDuration);
    };
  });
}

// Listen for custom event from SortableJS, update component order
window.addEventListener('componentOrderChanged', event => {
  const { column, order } = event.detail;
  const column_components = components.filter(c => c.active && c.column === column);
  // Update positions in the data model
  order.forEach((component_id, position) => {
    const comp = column_components.find(c => c.id === component_id);
    if (comp) comp.position = position;
  });
  // Defensive re-index
  column_components.forEach((comp, idx) => {
    if (typeof comp.position !== 'number') comp.position = idx;
  });
  render_component_items();
});

// Initialise the UI on load
render_component_buttons();
render_component_items();

