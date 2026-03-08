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
// The 'asideInfo' property is the description shown in the component information drawer when the component is clicked.
export const componentCatalog = [
  { typeId: 1, componentName: 'small_image_heading', name: 'Small Image and Heading', column: [1], asideInfo: 'Displays the vehicle image thumbnail with the make, model, and variant name.' },
  { typeId: 2, componentName: 'stock_ctas', name: 'CTAs', column: [1], asideInfo: "Call-to-action buttons for primary actions like 'Book Test Drive' or 'Make an Enquiry'." },
  { typeId: 3, componentName: 'stock_price', name: 'Price', column: [1], asideInfo: 'Displays the vehicle price with optional was/now pricing and drive-away information.' },
  { typeId: 4, componentName: 'stock_image_carousel_wide', name: 'Image Carousel Wide', column: [1], asideInfo: 'Full-width image gallery showcasing vehicle photos with thumbnails and navigation.' },
  { typeId: 5, componentName: 'stock_image_carousel', name: 'Image Carousel', column: [2, 3], asideInfo: 'Image gallery showcasing vehicle photos with thumbnails and navigation.' },
  { typeId: 6, componentName: 'stock_heading_ctas', name: 'Heading and CTAs', column: [2, 3], asideInfo: 'Displays the make, model, variant name and price. The CTAs can be configured to open a standard form, internal link, external link, iframe finance forms or dynamic forms.' },
  { typeId: 7, componentName: 'stock_finance_calculator', name: 'Finance Calculator', column: [2, 3], asideInfo: 'Interactive finance calculator allowing customers to estimate repayments with adjustable deposit and term.' },
  { typeId: 8, componentName: 'stock_price_comparison', name: 'Price Comparison', column: [2, 3], asideInfo: "Shows the vehicle's price comparison against market average with visual indicators." },
  { typeId: 9, componentName: 'stock_features', name: 'Stock Features', column: [2, 3], asideInfo: 'Key vehicle features displayed as a list with icons (e.g., kilometres, transmission, fuel type).' },
  { typeId: 10, componentName: 'stock_comments', name: 'Stock Comments', column: [2, 3], asideInfo: 'Dealer comments and vehicle description providing additional context and selling points.' },
  { typeId: 11, componentName: 'stock_wildcard', name: 'Wildcard', column: [2, 3], asideInfo: 'Flexible component for custom content blocks, promotional banners, or dealer-specific messaging.' },
  { typeId: 12, componentName: 'stock_similar_vehicles', name: 'Similar Vehicles', column: [2, 3, 4], asideInfo: 'Carousel showing related vehicles from the same dealership or similar make/model.' },
  { typeId: 13, componentName: 'stock_forms', name: 'Form', column: [2, 3, 4], asideInfo: 'Contact and enquiry forms for lead capture and dealer communication.' },
  { typeId: 14, componentName: 'stock_form_accordion', name: 'Form Accordion', column: [2, 3], asideInfo: 'Collapsible enquiry form that expands to show contact fields. Multiple form types available.' },
  { typeId: 15, componentName: 'stock_map_locations', name: 'Map Locations', column: [4], asideInfo: 'Interactive map showing dealership locations with contact details and directions.' }
];

/**
 * Returns the name and aside info for the component with the given typeId, or null if not found.
 * @param {number} typeId
 * @returns {{ name: string, asideInfo: string } | null}
 */
export function getComponentAsideInfo(typeId) {
  const entry = componentCatalog.find(c => c.typeId === typeId);
  if (!entry || entry.asideInfo == null) return null;
  return { name: entry.name, asideInfo: entry.asideInfo };
}

// Fetches the configured fade transition duration from the root CSS variable, defaulting to 500ms if not set.
export function get_fade_transition_duration() {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue('--fadeTransitionDuration').trim();
  return value ? parseInt(value.replace('ms', ''), 10) : 500;
}
