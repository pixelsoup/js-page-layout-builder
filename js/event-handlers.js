import {
  component_item_id_prefix,
  column_selector_id_prefix,
  visibility_selector_id_prefix,
  column_two_id,
  column_three_id,
  get_fade_transition_duration
} from './config.js';

import {
  componentInstances,
  deleteComponentInstance,
  duplicateComponentInstance,
  updateInstanceColumn,
  updateInstanceVisibility,
  reindexColumn
} from './data-model.js';

import { render_component_items } from './rendering.js';

/**
 * Attaches event handlers for column selector changes, visibility changes, and delete actions.
 */
export function attach_component_events() {
  // Column selector change handler
  document.querySelectorAll('.componentColumnSelector').forEach(selector => {
    selector.onchange = () => {
      const instanceId = selector.id.replace(column_selector_id_prefix + '-', '');
      const newColumn = selector.value === 'column2' ? column_two_id : column_three_id;
      
      if (updateInstanceColumn(instanceId, newColumn)) {
        reindexColumn(newColumn);
        render_component_items();
      }
    };
  });

  // Visibility selector change handler
  document.querySelectorAll('.componentVisibilitySelector').forEach(selector => {
    selector.onchange = () => {
      const instanceId = selector.id.replace(visibility_selector_id_prefix + '-', '');
      const value = selector.value;
      
      if (updateInstanceVisibility(instanceId, value)) {
        render_component_items();
      }
    };
  });

  // Delete button handler
  document.querySelectorAll('.btn-delete-wrapper').forEach(delete_button => {
    delete_button.onclick = () => {
      const instanceId = delete_button.dataset.instanceId;
      const instance = componentInstances.find(inst => inst.instanceId === instanceId);
      if (!instance) return;

      // Start fade-out animation
      const component_element = document.getElementById(`${component_item_id_prefix}-${instanceId}`);
      if (component_element) {
        component_element.classList.add('fading-out');
      }

      // After animation, remove instance
      setTimeout(() => {
        const deletedInstance = deleteComponentInstance(instanceId);
        if (deletedInstance) {
          reindexColumn(deletedInstance.column);
          render_component_items();
        }
      }, get_fade_transition_duration());
    };
  });
}

/**
 * Handles info button click to toggle visibility of component information
 * @param {number} typeId
 */
function toggleComponentInformation(typeId) {
  const allInfoDivs = document.querySelectorAll('.componentInfo');
  const targetInfoDiv = document.getElementById(`js-component${typeId}-information`);

  // Hide all information divs
  allInfoDivs.forEach(div => div.classList.add('hidden'));

  // Show the target information div
  if (targetInfoDiv) {
    targetInfoDiv.classList.remove('hidden');
  }
}

/**
 * Toggles the visibility of the component info drawer
 * @param {boolean} isOpen
 */
function toggleComponentInfoDrawer(isOpen) {
  const infoDrawer = document.getElementById('js-componentInfoDrawer');
  const layoutWrapper = document.querySelector('.layoutBuilderWrapper');

  if (isOpen) {
    infoDrawer.classList.remove('hidden');
    layoutWrapper.classList.add('drawer-open');
  } else {
    infoDrawer.classList.add('hidden');
    layoutWrapper.classList.remove('drawer-open');
  }
}

/**
 * Dynamically attach event listener to info button
 * @param {string} instanceId
 * @param {number} typeId
 */
export function attachInfoButtonEvent(instanceId, typeId) {
  const infoButton = document.getElementById(`js-component-btn-info-${instanceId}`);
  if (infoButton) {
    infoButton.onclick = () => {
      toggleComponentInfoDrawer(true);
      toggleComponentInformation(typeId);
    };
  }
}

/**
 * Attach event listener to duplicate button
 * @param {string} instanceId
 */
export function attachDuplicateButtonEvent(instanceId) {
  const duplicateButton = document.getElementById(`js-component-btn-duplicate-${instanceId}`);
  if (duplicateButton) {
    duplicateButton.onclick = () => {
      const newInstance = duplicateComponentInstance(instanceId);
      if (newInstance) {
        reindexColumn(newInstance.column);
        render_component_items();
      }
    };
  }
}

/**
 * Initialize drawer close button
 */
export function initDrawerCloseButton() {
  const closeDrawerBtn = document.getElementById('js-closeComponentInfoDrawer');
  if (closeDrawerBtn) {
    closeDrawerBtn.onclick = () => toggleComponentInfoDrawer(false);
  }
}

/**
 * Initialize escape key to close drawer
 */
export function initEscapeKeyHandler() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleComponentInfoDrawer(false);
    }
  });
}
