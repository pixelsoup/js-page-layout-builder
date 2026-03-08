// DOM elements
export const main_tabs_panel = document.getElementById('js-componentTabPane');
export const column_one = document.querySelector('#js-column1');
export const column_two = document.querySelector('#js-column2');
export const column_three = document.querySelector('#js-column3');
export const column_four = document.querySelector('#js-column4');
export const tab_buttons = document.querySelectorAll('.js-aside-tab');

// Prefixes and class names for DOM structure and styling
export const component_add_button_id_prefix = 'js-componentBtn';
export const component_item_id_prefix = 'js-component';
export const component_item_wrapper_class = 'lb-component-item-wrapper';
export const column_selector_id_prefix = 'js-colSelector';
export const visibility_selector_id_prefix = 'js-visSelector';

// Column identifiers (as referenced in the data model)
export const column_two_id = 2;
export const column_three_id = 3;

// Component catalog - read-only list of available component types
// The 'column' property is an array of column IDs (1-4) for which this component is eligible.
export const componentCatalog = [
  { typeId: 1, componentName: 'small_image_heading', name: 'Small Image and Heading', column: [1] },
  { typeId: 2, componentName: 'stock_ctas', name: 'CTAs', column: [1] },
  { typeId: 3, componentName: 'stock_price', name: 'Price', column: [1] },
  { typeId: 4, componentName: 'stock_image_carousel_wide', name: 'Image Carousel Wide', column: [1] },
  { typeId: 5, componentName: 'stock_image_carousel', name: 'Image Carousel', column: [2, 3] },
  { typeId: 6, componentName: 'stock_heading_ctas', name: 'Heading and CTAs', column: [2, 3] },
  { typeId: 7, componentName: 'stock_finance_calculator', name: 'Finance Calculator', column: [2, 3] },
  { typeId: 8, componentName: 'stock_price_comparison', name: 'Price Comparison', column: [2, 3] },
  { typeId: 9, componentName: 'stock_features', name: 'Stock Features', column: [2, 3] },
  { typeId: 10, componentName: 'stock_comments', name: 'Stock Comments', column: [2, 3] },
  { typeId: 11, componentName: 'stock_wildcard', name: 'Wildcard', column: [2, 3] },
  { typeId: 12, componentName: 'stock_similar_vehicles', name: 'Similar Vehicles', column: [2, 3, 4] },
  { typeId: 13, componentName: 'stock_forms', name: 'Form', column: [2, 3, 4] },
  { typeId: 14, componentName: 'stock_form_accordion', name: 'Form Accordion', column: [2, 3] },
  { typeId: 15, componentName: 'stock_map_locations', name: 'Map Locations', column: [4] }
];

// Fetches the configured fade transition duration from the root CSS variable, defaulting to 500ms if not set.
export function get_fade_transition_duration() {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue('--fadeTransitionDuration').trim();
  return value ? parseInt(value.replace('ms', ''), 10) : 500;
}
