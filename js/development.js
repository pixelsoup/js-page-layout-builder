// Configuration constants
const column_1_value = 1;
const column_2_value = 2;
const component_button_id_prefix = 'js-componentBtn';
const component_item_id_prefix = 'js-component';
const component_item_wrapper_class = 'componentItemWrapper';
const column_selector_id_prefix = 'js-colSelector';
const fade_transition_duration = 500; // ms

// Component data array
const components = [
  { id: 1, componentName: 'component_one', name: 'Image Carousel', active: false, column: column_1_value },
  { id: 2, componentName: 'component_two', name: 'Form', active: false, column: column_1_value },
  { id: 3, componentName: 'component_three', name: 'CTAs', active: false, column: column_1_value },
  { id: 4, componentName: 'component_four', name: 'Key Features', active: false, column: column_1_value },
  { id: 5, componentName: 'component_five', name: 'Dealer Location  ', active: false, column: column_1_value },
  { id: 6, componentName: 'component_six', name: 'Comments', active: false, column: column_1_value },
  { id: 7, componentName: 'component_seven', name: 'Full Specifications', active: false, column: column_1_value },
  { id: 8, componentName: 'component_eight', name: 'Disclaimer', active: false, column: column_1_value },
  { id: 9, componentName: 'component_nine', name: 'Stock Specials', active: false, column: column_1_value },
  { id: 10, componentName: 'component_ten', name: 'Price Rating', active: false, column: column_1_value }
];

/**
 * Creates and inserts all component add buttons into the aside container.
 */
function renderComponentButtons() {
  const asideElement = document.getElementById('js-componentBtnsAside');
  asideElement.innerHTML = ''; // Clear existing buttons

  components.forEach(component => {
    // Create a new button for each component
    const button = document.createElement('button');
    button.id = `${component_button_id_prefix}${component.id}`;
    button.className = 'componentBtn';
    button.innerHTML = `${component.name} <span class="icon-trigger icon-add">+</span>`;

    // Attach click handler
    button.onclick = () => {
      if (button.classList.contains('inactive')) return;
      button.classList.add('fading-out');

      if (component && !component.active) {
        component.active = true;
        component.column = column_1_value;
        renderComponentItems(); // This will also update button state
      }

      setTimeout(() => {
        button.classList.remove('fading-out');
        button.classList.add('inactive');
      }, fade_transition_duration);
    };

    asideElement.appendChild(button);
  });

  // Update button states after render
  updateButtonStates();
}



// Cache DOM column elements
const column_one = document.querySelector('#js-column1');
const column_two = document.querySelector('#js-column2');

/**
 * Renders all active component items into their respective columns.
 * Clears both columns first, then populates with current component states.
 */
function renderComponentItems() {
  column_one.innerHTML = '';
  column_two.innerHTML = '';

  components.forEach(component => {
    if (!component.active) return;

    // Create a new component item DOM element
    const component_item = document.createElement('div');
    component_item.id = `${component_item_id_prefix}${component.id}`;
    component_item.className = component_item_wrapper_class;
    component_item.dataset.position = column_1_value;
    component_item.dataset.name = component.componentName;

    // Populate the component's inner HTML using template literals
    component_item.innerHTML = `
      ${component.name}
      <div class="componentItemTriggersWrapper">
        <select id="${column_selector_id_prefix}${component.id}" class="componentColumnSelector">
          <option value="column1" ${component.column === column_1_value ? 'selected' : ''}>
            Column 1
          </option>
          <option value="column2" ${component.column === column_2_value ? 'selected' : ''}>
            Column 2
          </option>
        </select>
        <span class="icon-trigger icon-delete" data-id="${component.id}">&ndash;</span>
      </div>
    `;

    // Append the component to the correct column
    const target_column = component.column === column_1_value ? column_one : column_two;
    target_column.appendChild(component_item);
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
        component.column = selector.value === 'column1' ? column_1_value : column_2_value;
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

      // After the animation, mark component inactive and re-render
      setTimeout(() => {
        component.active = false;
        renderComponentItems();
      }, fade_transition_duration);
    };
  });
}

// Attach event listeners to all add-component buttons
document.querySelectorAll('.componentBtn').forEach(add_button => {
  add_button.onclick = () => {
    if (add_button.classList.contains('inactive')) return;

    // Start fade-out animation on the button
    add_button.classList.add('fading-out');

    const component_id = parseInt(add_button.id.replace(component_button_id_prefix, ''), 10);
    const component = components.find(c => c.id === component_id);
    if (component && !component.active) {
      component.active = true;
      component.column = column_1_value;
      renderComponentItems();
    }

    // After animation, set the button as inactive
    setTimeout(() => {
      add_button.classList.remove('fading-out');
      add_button.classList.add('inactive');
    }, fade_transition_duration);
  };
});

// Initialize the UI by rendering all components
renderComponentButtons();
renderComponentItems();
