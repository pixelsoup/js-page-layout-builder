// Configuration constants
const column_2_value = 2;
const column_3_value = 3;
const component_button_id_prefix = 'js-componentBtn';
const component_item_id_prefix = 'js-component';
const component_item_wrapper_class = 'componentItemWrapper';
const column_selector_id_prefix = 'js-colSelector';
// Function to get the fade transition duration from CSS variables
function getFadeTransitionDuration() {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue('--imPageBuilderTransitionDuration').trim();
  return value ? parseInt(value, 10) : 500;
}


// Component data array
const components = [
    { id: 1, componentName: 'heading', name: 'Heading', active: false, column: null, row: 1 },
    { id: 2, componentName: 'price', name: 'Price', active: false, column: null, row: 1 },
    { id: 3, componentName: 'reserve_now', name: 'Reserve Now', active: false, column: null, row: 1 },
    { id: 4, componentName: 'other', name: 'Other', active: false, column: null, row: 1 },
    { id: 5, componentName: 'image_carousel', name: 'Image Carousel', active: false, column: column_2_value, row: 2 },
    { id: 6, componentName: 'standard_form', name: 'Form', active: false, column: column_2_value, row: 2 },
    { id: 7, componentName: 'ctas', name: 'CTAs', active: false, column: column_2_value, row: 2 },
    { id: 8, componentName: 'key_features', name: 'Key Features', active: false, column: column_2_value, row: 2 },
    { id: 9, componentName: 'dealer_location', name: 'Dealer Location', active: false, column: column_2_value, row: 2 },
    { id: 10, componentName: 'comments', name: 'Comments', active: false, column: column_2_value, row: 2 },
    { id: 11, componentName: 'full_specifications', name: 'Full Specifications', active: false, column: column_2_value, row: 2 },
    { id: 12, componentName: 'disclaimer', name: 'Disclaimer', active: false, column: column_2_value, row: 2 },
    { id: 13, componentName: 'stock_specials', name: 'Stock Specials', active: false, column: column_2_value, row: 2 },
    { id: 14, componentName: 'price_rating', name: 'Price Rating', active: false, column: column_2_value, row: 2 },
    { id: 15, componentName: 'similar_vehicles_carousel', name: 'Similar Vehicles Carousel', active: false, column: null, row: 3 }
];

/**
 * Creates and inserts all component add buttons into the aside container.
 */
function renderComponentButtons(activeTab = 1) {
const tabPanels = document.getElementById('js-componentTabPanels');
if (!tabPanels.dataset.initialized) {
    // Render all buttons once
    components.forEach(component => {
        const button = document.createElement('button');
        button.id = `${component_button_id_prefix}${component.id}`;
        button.className = `componentBtn componentBtn-row${component.row}`;
        button.innerHTML = `${component.name} <span class="icon-trigger icon-add">+</span>`;
        button.onclick = () => {
            if (button.classList.contains('inactive')) return;
            button.classList.add('fading-out');
            if (component && !component.active) {
                component.active = true;
                // Assign column based on row/component
                if (component.row === 1) component.column = 1;
                else if (component.row === 2) component.column = column_2_value;
                else if (component.row === 3) component.column = 4;
                renderComponentItems();
            }
            setTimeout(() => {
                button.classList.remove('fading-out');
                button.classList.add('inactive');
            }, getFadeTransitionDuration);
        };
        tabPanels.appendChild(button);
    });
    tabPanels.dataset.initialized = 'true';
}
// Toggle button visibility by tab
components.forEach(component => {
    const button = document.getElementById(`${component_button_id_prefix}${component.id}`);
    if (button) {
        if (component.row === activeTab) {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    }
});
updateButtonStates();
}

// Tab switching logic
document.querySelectorAll('.componentTab').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.componentTab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderComponentButtons(Number(tab.dataset.tab));
    };
});

// Initial render
document.querySelector('.componentTab[data-tab="1"]').classList.add('active');
renderComponentButtons(1);

// Cache DOM column elements
const column_one = document.querySelector('#js-column1');
const column_two = document.querySelector('#js-column2');
const column_three = document.querySelector('#js-column3');
const column_four = document.querySelector('#js-column4');

/**
 * Renders all active component items into their respective columns.
 * Clears both columns first, then populates with current component states.
 */
function renderComponentItems() {
  column_one.innerHTML = '';
  column_two.innerHTML = '';
  column_three.innerHTML = '';
  column_four.innerHTML = '';

  // Helper: get active components by column, sorted by position
  function getSortedActiveComponents(colNum) {
    return components.filter(c => c.active && c.column === colNum)
      .sort((a, b) => (a.position !== undefined ? a.position : 0) - (b.position !== undefined ? b.position : 0));
  }

  // Render row 1 (column 1)
  getSortedActiveComponents(1).forEach((component, idx) => {
    component.position = idx;
    const component_item = document.createElement('div');
    component_item.id = `${component_item_id_prefix}${component.id}`;
    component_item.className = component_item_wrapper_class;
    component_item.dataset.position = component.position;
    component_item.dataset.name = component.componentName;
    component_item.innerHTML = `
      <div class="componentItemHeaderName">
        <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
        ${component.name}
      </div>
      <div class="componentItemTriggersWrapper">
        <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
      </div>
    `;
    column_one.appendChild(component_item);
  });

  // Render row 2 (column 2 and 3)
  getSortedActiveComponents(column_2_value).forEach((component, idx) => {
    component.position = idx;
    const component_item = document.createElement('div');
    component_item.id = `${component_item_id_prefix}${component.id}`;
    component_item.className = component_item_wrapper_class;
    component_item.dataset.position = component.position;
    component_item.dataset.name = component.componentName;
    let selectorHTML = `
      <select id="${column_selector_id_prefix}${component.id}" class="componentColumnSelector">
        <option value="column2" ${component.column === column_2_value ? 'selected' : ''}>Column 1</option>
        <option value="column3" ${component.column === column_3_value ? 'selected' : ''}>Column 2</option>
      </select>
    `;
    component_item.innerHTML = `
      <div class="componentItemHeaderName">
        <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
        ${component.name}
      </div>
      <div class="componentItemTriggersWrapper">
        ${selectorHTML}
        <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
      </div>
    `;
    column_two.appendChild(component_item);
  });
  getSortedActiveComponents(column_3_value).forEach((component, idx) => {
    component.position = idx;
    const component_item = document.createElement('div');
    component_item.id = `${component_item_id_prefix}${component.id}`;
    component_item.className = component_item_wrapper_class;
    component_item.dataset.position = component.position;
    component_item.dataset.name = component.componentName;
    let selectorHTML = `
      <select id="${column_selector_id_prefix}${component.id}" class="componentColumnSelector">
        <option value="column2" ${component.column === column_2_value ? 'selected' : ''}>Column 1</option>
        <option value="column3" ${component.column === column_3_value ? 'selected' : ''}>Column 2</option>
      </select>
    `;
    component_item.innerHTML = `
      <div class="componentItemHeaderName">
        <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
        ${component.name}
      </div>
      <div class="componentItemTriggersWrapper">
        ${selectorHTML}
        <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
      </div>
    `;
    column_three.appendChild(component_item);
  });

  // Render row 3 (column 4)
  getSortedActiveComponents(4).forEach((component, idx) => {
    component.position = idx;
    const component_item = document.createElement('div');
    component_item.id = `${component_item_id_prefix}${component.id}`;
    component_item.className = component_item_wrapper_class;
    component_item.dataset.position = component.position;
    component_item.dataset.name = component.componentName;
    component_item.innerHTML = `
      <div class="componentItemHeaderName">
        <svg class="lg-icon icon-grabber"><use xlink:href="#svg-grabber"></use></svg>
        ${component.name}
      </div>
      <div class="componentItemTriggersWrapper">
        <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
      </div>
    `;
    column_four.appendChild(component_item);
  });

  updateButtonStates();
  attachComponentEvents();
}

/**
 * Updates the visual state of all component add buttons.
 * Removes styling from buttons that are not associated with active components.
 */
function updateButtonStates() {
  components.forEach(component => {
    const add_button = document.getElementById(`${component_button_id_prefix}${component.id}`);
    if (add_button && !component.active) {
      add_button.classList.remove('inactive', 'fading-out');
    }
  });
}

/**
 * Attaches event handlers for column selector changes and delete button clicks.
 */
function attachComponentEvents() {
  // Handle column selector changes
  document.querySelectorAll('.componentColumnSelector').forEach(selector => {
    selector.onchange = () => {
      const component_id = parseInt(selector.id.replace(column_selector_id_prefix, ''), 10);
      const component = components.find(c => c.id === component_id);
      if (component) {
        component.column = selector.value === 'column2' ? column_2_value : column_3_value;
        renderComponentItems();
      }
    };
  });

  // Handle delete button clicks
  document.querySelectorAll('.icon-delete').forEach(delete_button => {
    delete_button.onclick = () => {
      const component_id = parseInt(delete_button.dataset.id, 10);
      const component = components.find(c => c.id === component_id);
      if (!component || !component.active) return;

      // Re-enable the add button immediately
      const add_button = document.getElementById(`${component_button_id_prefix}${component_id}`);
      if (add_button) {
        add_button.classList.remove('inactive', 'fading-out');
      }

      // Start fade-out animation on the component
      const component_element = document.getElementById(`${component_item_id_prefix}${component_id}`);
      if (component_element) {
        component_element.classList.add('fading-out');
      }

      // After the animation, mark component inactive, shift positions, and re-render
      setTimeout(() => {
            component.active = false;
            const colComps = components.filter(c => c.active && c.column === component.column);
            colComps.sort((a, b) => a.position - b.position); // Preserve current order
            colComps.forEach((c, idx) => c.position = idx); // Re-index positions
            renderComponentItems();
        }, getFadeTransitionDuration());
    };
  });
}


// Listen for SortableJS order change events and update the data model
window.addEventListener('componentOrderChanged', function(e) {
  const { column, order } = e.detail;
  // Only update active components in this column
  let colComps = components.filter(c => c.active && c.column === column);
  // Map order array to component objects
  order.forEach((id, idx) => {
    let comp = colComps.find(c => c.id === id);
    if (comp) comp.position = idx;
  });
  // Defensive: re-index any missing positions
  colComps.forEach((c, idx) => {
    if (typeof c.position !== 'number') c.position = idx;
  });
  renderComponentItems();
});

// Initialize the UI by rendering all components
renderComponentButtons();
renderComponentItems();
