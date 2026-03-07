import {
  tab_buttons,
  column_one,
  column_two,
  column_three,
  column_four
} from './config.js';

import { render_component_buttons } from './rendering.js';

/**
 * Sets the active tab and highlights the corresponding column(s) based on the clicked column.
 * @param {HTMLElement} clickedColumn - The column that was clicked.
 */
export function setActiveTabAndColumn(clickedColumn) {
  // Tabs
  const tab1 = document.getElementById('js-componentsTab1');
  const tab2 = document.getElementById('js-componentsTab2');
  const tab3 = document.getElementById('js-componentsTab3');
  // Columns
  const col1 = document.getElementById('js-column1');
  const col2 = document.getElementById('js-column2');
  const col3 = document.getElementById('js-column3');
  const col4 = document.getElementById('js-column4');

  // Remove all .active
  [tab1, tab2, tab3, col1, col2, col3, col4].forEach(el => el.classList.remove('active'));

  if (clickedColumn === col1) {
    tab1.classList.add('active');
    col1.classList.add('active');
  } else if (clickedColumn === col2 || clickedColumn === col3) {
    tab2.classList.add('active');
    col2.classList.add('active');
    col3.classList.add('active');
  } else if (clickedColumn === col4) {
    tab3.classList.add('active');
    col4.classList.add('active');
  }
}

/**
 * Helper to check if an element is a column or child of a column
 * @param {Event} e
 * @returns {HTMLElement|null}
 */
function getColumnFromEvent(e) {
  let el = e.target;
  while (el && el !== document.body) {
    if (el.id === 'js-column1') return document.getElementById('js-column1');
    if (el.id === 'js-column2') return document.getElementById('js-column2');
    if (el.id === 'js-column3') return document.getElementById('js-column3');
    if (el.id === 'js-column4') return document.getElementById('js-column4');
    el = el.parentElement;
  }
  return null;
}

/**
 * Initialize tab button click handlers
 */
export function initTabButtons() {
  tab_buttons.forEach(tab => {
    tab.onclick = () => {
      tab_buttons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render_component_buttons(parseInt(tab.dataset.tab, 10));

      // Remove .active from all columns
      [column_one, column_two, column_three, column_four].forEach(col => col.classList.remove('active'));
      // Add .active to correct columns
      if (tab.id === 'js-componentsTab1') {
        column_one.classList.add('active');
      } else if (tab.id === 'js-componentsTab2') {
        column_two.classList.add('active');
        column_three.classList.add('active');
      } else if (tab.id === 'js-componentsTab3') {
        column_four.classList.add('active');
      }
    };
  });

  // Initial render
  document.querySelector('.componentsTab[data-tab="1"]').classList.add('active');
}

/**
 * Initialize column click handlers
 */
export function initColumnClickHandlers() {
  ['js-column1','js-column2','js-column3','js-column4'].forEach(colId => {
    const col = document.getElementById(colId);
    if (col) {
      col.addEventListener('click', function(e) {
        const clickedCol = getColumnFromEvent(e);
        if (clickedCol) {
          setActiveTabAndColumn(clickedCol);

          // Toggle button visibility based on active tab
          if (clickedCol.id === 'js-column1') {
            render_component_buttons(1);
          } else if (clickedCol.id === 'js-column2' || clickedCol.id === 'js-column3') {
            render_component_buttons(2);
          } else if (clickedCol.id === 'js-column4') {
            render_component_buttons(3);
          }
        }
      });
    }
  });
}
