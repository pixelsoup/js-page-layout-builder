import {
  tab_buttons,
  column_one,
  column_two,
  column_three,
  column_four
} from './config.js';

import { render_component_buttons } from './rendering.js';

/**
 * Sets the active tab and highlights the corresponding column based on the clicked column.
 * Tab number maps 1:1 to column number. Only the clicked column gets .active.
 * @param {HTMLElement} clickedColumn - The column that was clicked.
 */
export function setActiveTabAndColumn(clickedColumn) {
  const tab1 = document.getElementById('js-componentsTab1');
  const tab2 = document.getElementById('js-componentsTab2');
  const tab3 = document.getElementById('js-componentsTab3');
  const tab4 = document.getElementById('js-componentsTab4');
  const col1 = document.getElementById('js-column1');
  const col2 = document.getElementById('js-column2');
  const col3 = document.getElementById('js-column3');
  const col4 = document.getElementById('js-column4');

  [tab1, tab2, tab3, tab4, col1, col2, col3, col4].forEach(el => el.classList.remove('active'));

  if (clickedColumn === col1) {
    tab1.classList.add('active');
    col1.classList.add('active');
  } else if (clickedColumn === col2) {
    tab2.classList.add('active');
    col2.classList.add('active');
  } else if (clickedColumn === col3) {
    tab3.classList.add('active');
    col3.classList.add('active');
  } else if (clickedColumn === col4) {
    tab4.classList.add('active');
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
 * Initialize tab button click handlers. Tab number (1-4) equals column number.
 */
export function initTabButtons() {
  tab_buttons.forEach(tab => {
    tab.onclick = () => {
      tab_buttons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const columnNumber = parseInt(tab.dataset.tab, 10);
      render_component_buttons(columnNumber);

      [column_one, column_two, column_three, column_four].forEach(col => col.classList.remove('active'));
      if (tab.id === 'js-componentsTab1') column_one.classList.add('active');
      else if (tab.id === 'js-componentsTab2') column_two.classList.add('active');
      else if (tab.id === 'js-componentsTab3') column_three.classList.add('active');
      else if (tab.id === 'js-componentsTab4') column_four.classList.add('active');
    };
  });

  document.querySelector('.js-aside-tab[data-tab="1"]').classList.add('active');
}

/**
 * Initialize column click handlers. Column click activates the matching tab (tab number = column number).
 */
export function initColumnClickHandlers() {
  ['js-column1', 'js-column2', 'js-column3', 'js-column4'].forEach(colId => {
    const col = document.getElementById(colId);
    if (col) {
      col.addEventListener('click', function(e) {
        const clickedCol = getColumnFromEvent(e);
        if (clickedCol) {
          setActiveTabAndColumn(clickedCol);
          const columnNumber = parseInt(clickedCol.id.replace('js-column', ''), 10);
          render_component_buttons(columnNumber);
        }
      });
    }
  });
}
