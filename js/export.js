import { componentInstances, clearAllInstances } from './data-model.js';
import { render_component_items } from './rendering.js';

/**
 * Export configuration as JSON
 * @returns {object}
 */
export function exportConfiguration() {
  return {
    componentInstances: componentInstances.map(inst => ({
      instanceId: inst.instanceId,
      typeId: inst.typeId,
      column: inst.column,
      position: inst.position,
      hideOnMobile: inst.hideOnMobile,
      hideOnDesktop: inst.hideOnDesktop
    })),
    breakpoint: 768
  };
}

/**
 * Copy configuration to clipboard
 */
export function copyConfigToClipboard() {
  const config = exportConfiguration();
  const jsonString = JSON.stringify(config, null, 2);
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('Configuration copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy configuration:', err);
      fallbackCopyToClipboard(jsonString);
    });
  } else {
    fallbackCopyToClipboard(jsonString);
  }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    alert('Configuration copied to clipboard!');
  } catch (err) {
    console.error('Fallback: Failed to copy', err);
    alert('Failed to copy configuration. Check console for JSON output.');
    console.log('Configuration JSON:', text);
  }
  document.body.removeChild(textArea);
}

/**
 * Initialize copy config button
 */
export function initCopyConfigButton() {
  const copyConfigBtn = document.getElementById('js-copyConfigBtn');
  if (copyConfigBtn) {
    copyConfigBtn.onclick = () => copyConfigToClipboard();
  }
}

/**
 * Initialize clear all button
 */
export function initClearAllButton() {
  const clearAllBtn = document.getElementById('js-clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.onclick = () => {
      if (componentInstances.length === 0) {
        alert('No components to clear.');
        return;
      }
      
      if (confirm('Are you sure you want to remove all components?')) {
        clearAllInstances();
        render_component_items();
      }
    };
  }
}
