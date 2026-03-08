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
export const componentCatalog = [
  { typeId: 1, componentName: 'small_image_heading', name: 'Small Image and Heading', row: 1 },
  { typeId: 2, componentName: 'ctas', name: 'CTAs', row: 1 },
  { typeId: 3, componentName: 'price', name: 'Price', row: 1 },
  { typeId: 4, componentName: 'image_carousel', name: 'Image Carousel', row: 2, defaultColumn: column_two_id },
  { typeId: 5, componentName: 'heading_ctas', name: 'Heading and CTAs', row: 2, defaultColumn: column_two_id },
  { typeId: 6, componentName: 'finance_calculator', name: 'Finance Calculator', row: 2, defaultColumn: column_two_id },
  { typeId: 7, componentName: 'good_price_comparison', name: 'Good Price/Best Price Comparison', row: 2, defaultColumn: column_two_id },
  { typeId: 8, componentName: 'stock_features', name: 'Stock Features', row: 2, defaultColumn: column_two_id },
  { typeId: 9, componentName: 'stock_comments', name: 'Stock Comments', row: 2, defaultColumn: column_two_id },
  { typeId: 10, componentName: 'accordion', name: 'Accordion', row: 2, defaultColumn: column_two_id },
  { typeId: 11, componentName: 'similar_vehicles', name: 'Similar Vehicles', row: 2, defaultColumn: column_two_id },
  { typeId: 12, componentName: 'enquire_now_form_accordion', name: 'Enquire Now Form Accordion', row: 2, defaultColumn: column_three_id },
  { typeId: 13, componentName: 'wildcard', name: 'Wildcard', row: 2, defaultColumn: column_three_id },
  { typeId: 14, componentName: 'map_locations', name: 'Map Locations', row: 3 }
];

// Fetches the configured fade transition duration from the root CSS variable, defaulting to 500ms if not set.
export function get_fade_transition_duration() {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue('--fadeTransitionDuration').trim();
  return value ? parseInt(value.replace('ms', ''), 10) : 500;
}
