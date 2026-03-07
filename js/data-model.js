import { componentCatalog, column_two_id, column_three_id } from './config.js';
import { saveToStorage } from './persistence.js';

// Instance ID counter
let instance_id_counter = 0;

// Component instances - mutable list of placed components
export let componentInstances = [];

/**
 * Set component instances (used when loading from storage)
 * @param {Array} instances
 */
export function setComponentInstances(instances) {
  // Clear array without reassigning (preserves references in other modules)
  componentInstances.length = 0;
  // Push all loaded instances
  componentInstances.push(...instances);
  
  // Update counter to prevent ID collisions
  instances.forEach(inst => {
    const match = inst.instanceId.match(/instance-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > instance_id_counter) {
        instance_id_counter = num;
      }
    }
  });
}

/**
 * Clear all component instances
 */
export function clearAllInstances() {
  // Clear array without reassigning (preserves references in other modules)
  componentInstances.length = 0;
  instance_id_counter = 0;
  saveToStorage(componentInstances);
}

/**
 * Generate a unique instance ID
 * @returns {string} - Unique instance ID
 */
export function generateInstanceId() {
  return `instance-${++instance_id_counter}`;
}

/**
 * Get component type from catalog by typeId
 * @param {number} typeId
 * @returns {object|null}
 */
export function getComponentType(typeId) {
  return componentCatalog.find(c => c.typeId === typeId) || null;
}

/**
 * Get all instances of a specific type
 * @param {number} typeId
 * @returns {Array}
 */
export function getInstancesByType(typeId) {
  return componentInstances.filter(inst => inst.typeId === typeId);
}

/**
 * Returns instances for the given column, sorted by their position.
 * @param {number} column_id
 * @returns {Array} - Sorted instances
 */
export function get_sorted_instances(column_id) {
  return componentInstances
    .filter(inst => inst.column === column_id)
    .sort((a, b) => a.position - b.position);
}

/**
 * Add a new component instance
 * @param {number} typeId
 */
export function addComponentInstance(typeId) {
  const compType = getComponentType(typeId);
  if (!compType) return;

  // Determine column
  let column;
  if (compType.row === 1) column = 1;
  else if (compType.row === 2) column = compType.defaultColumn || column_two_id;
  else if (compType.row === 3) column = 4;

  // Get existing instances in this column to determine position
  const existingInColumn = componentInstances
    .filter(inst => inst.column === column)
    .sort((a, b) => a.position - b.position);
  const position = existingInColumn.length;

  // Create new instance
  const newInstance = {
    instanceId: generateInstanceId(),
    typeId: typeId,
    column: column,
    position: position,
    hideOnMobile: false,
    hideOnDesktop: false
  };

  componentInstances.push(newInstance);
  saveToStorage(componentInstances);
  return newInstance;
}

/**
 * Re-index positions in a column after changes
 * @param {number} column_id
 */
export function reindexColumn(column_id) {
  const instances = get_sorted_instances(column_id);
  instances.forEach((inst, idx) => {
    inst.position = idx;
  });
}

/**
 * Delete a component instance
 * @param {string} instanceId
 */
export function deleteComponentInstance(instanceId) {
  const idx = componentInstances.findIndex(inst => inst.instanceId === instanceId);
  if (idx !== -1) {
    const instance = componentInstances[idx];
    componentInstances.splice(idx, 1);
    saveToStorage(componentInstances);
    return instance;
  }
  return null;
}

/**
 * Duplicate a component instance
 * @param {string} instanceId
 * @returns {object|null} - The new instance or null
 */
export function duplicateComponentInstance(instanceId) {
  const instance = componentInstances.find(inst => inst.instanceId === instanceId);
  if (!instance) return null;

  // Create duplicate with same properties but new ID
  const newInstance = {
    instanceId: generateInstanceId(),
    typeId: instance.typeId,
    column: instance.column,
    position: instance.position + 1,
    hideOnMobile: instance.hideOnMobile,
    hideOnDesktop: instance.hideOnDesktop
  };

  // Insert after the current instance
  const currentIndex = componentInstances.findIndex(inst => inst.instanceId === instanceId);
  componentInstances.splice(currentIndex + 1, 0, newInstance);

  saveToStorage(componentInstances);
  return newInstance;
}

/**
 * Update instance column
 * @param {string} instanceId
 * @param {number} newColumn
 */
export function updateInstanceColumn(instanceId, newColumn) {
  const instance = componentInstances.find(inst => inst.instanceId === instanceId);
  if (instance && instance.column !== newColumn) {
    instance.column = newColumn;
    saveToStorage(componentInstances);
    return true;
  }
  return false;
}

/**
 * Update instance visibility
 * @param {string} instanceId
 * @param {string} visibilityValue - 'both', 'desktop', or 'mobile'
 */
export function updateInstanceVisibility(instanceId, visibilityValue) {
  const instance = componentInstances.find(inst => inst.instanceId === instanceId);
  if (instance) {
    instance.hideOnMobile = visibilityValue === 'desktop';
    instance.hideOnDesktop = visibilityValue === 'mobile';
    saveToStorage(componentInstances);
    return true;
  }
  return false;
}

/**
 * Update component order after drag and drop
 * @param {number} column - Column ID
 * @param {Array<string>} order - Array of instance IDs in new order
 */
export function updateComponentOrder(column, order) {
  console.log(`  → updateComponentOrder: column ${column}, order:`, order);
  
  order.forEach((instanceId, position) => {
    const inst = componentInstances.find(i => i.instanceId === instanceId);
    if (inst) {
      const oldColumn = inst.column;
      inst.column = column;
      inst.position = position;
      console.log(`    ✓ Updated ${instanceId}: column ${oldColumn} → ${column}, position ${position}`);
    } else {
      console.warn(`    ✗ Instance ${instanceId} not found in data model!`);
    }
  });
  
  saveToStorage(componentInstances);
  console.log('  → Saved to storage. Current state:', componentInstances.map(i => ({ id: i.instanceId, col: i.column, pos: i.position })));
}
