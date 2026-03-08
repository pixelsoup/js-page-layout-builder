import {
  component_item_id_prefix,
  visibility_selector_id_prefix,
  get_fade_transition_duration,
  getComponentAsideInfo
} from './config.js';

import {
  componentInstances,
  deleteComponentInstance,
  updateInstanceVisibility,
  reindexColumn
} from './data-model.js';

import { render_component_items } from './rendering.js';

/**
 * Attaches event handlers for visibility changes and delete actions.
 */
export function attach_component_events() {
  // Visibility selector change handler
  document.querySelectorAll('.js-component-visibility-select').forEach(selector => {
    selector.onchange = () => {
      const instanceId = selector.id.replace(visibility_selector_id_prefix + '-', '');
      const value = selector.value;

      if (updateInstanceVisibility(instanceId, value)) {
        render_component_items();
      }
    };
  });

  // Delete button handler
  document.querySelectorAll('.js-btn-delete').forEach(delete_button => {
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
 * Handles info button click to show component information from the catalog
 * @param {number} typeId
 */
function toggleComponentInformation(typeId) {
  const contentWrapper = document.getElementById('js-component-info-content');
  const asideInfoParagraph = contentWrapper?.querySelector('.lb-aside-info-text');
  const info = getComponentAsideInfo(typeId);

  if (!contentWrapper || !asideInfoParagraph) return;

  if (info) {
    asideInfoParagraph.innerHTML = `<strong>${info.name}:</strong> ${info.asideInfo}`;
    contentWrapper.classList.remove('hidden');
  } else {
    contentWrapper.classList.add('hidden');
  }
}

/**
 * Toggles the visibility of the component info drawer
 * @param {boolean} isOpen
 */
function toggleComponentInfoDrawer(isOpen) {
  const infoDrawer = document.getElementById('js-componentInfoDrawer');
  const layoutWrapper = document.querySelector('.js-layout-builder-wrapper');

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
