function dropdown({ closeAfterSelect = true }) {
  const triggers = document.querySelectorAll('[data-dd-target]');

  let index = -1,
    isOpened = false,
    focusedEl = '';

  function toggleClass(element, className) {
    if (element.classList.contains(className)) {
      setTimeout(() => {
        element.classList.remove(className);
        isOpened = false;
      });
    } else {
      setTimeout(() => {
        element.classList.add(className);
        isOpened = true;
      });
    }
  }

  function deleteActiveClassInArr(arr, className) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].classList.remove(className);
    }
  }

  function addActiveClassMenuEl(arr, className) {
    deleteActiveClassInArr(arr, className);
    arr[index].classList.add(className);
  }

  function closeMenu(menu, activeClass) {
    index = -1;
    isOpened = false;
    menu.classList.remove(activeClass);
  }

  triggers.forEach((trigger) => {
    const path = trigger.getAttribute('data-dd-target'),
      menu = document.querySelector(`[data-dd-path="${path}"]`),
      menuItems = menu.querySelectorAll('.dropdown-menu__item');

    menuItems.forEach((item) => {
      item.addEventListener('focus', (e) => {
        focusedEl = e.target;
      });

      item.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' && e.target === focusedEl) {
          if (closeAfterSelect && e.target.href) {
            closeMenu(menu, 'dropdown-menu--active');
          }
        }

        if (e.code === 'Escape' && focusedEl) {
          closeMenu(menu, 'dropdown-menu--active');
          trigger.focus();
        }
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      const isClickInside = menu.contains(target);

      if (target && target === trigger) {
        e.preventDefault();
        toggleClass(menu, 'dropdown-menu--active');
      }

      if (target && !isClickInside) {
        index = -1;
        closeMenu(menu, 'dropdown-menu--active');
        deleteActiveClassInArr(menuItems, 'dropdown-menu__item--active');
      }

      if (isClickInside && closeAfterSelect && target.href) {
        index = -1;
        closeMenu(menu, 'dropdown-menu--active');
        deleteActiveClassInArr(menuItems, 'dropdown-menu__item--active');
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        closeMenu(menu, 'dropdown-menu--active');
        deleteActiveClassInArr(menuItems, 'dropdown-menu__item--active');
      }

      if (isOpened && menuItems.length > 0) {
        switch (e.code) {
          case 'ArrowUp':
            index--;
            if (index < 0) {
              index = menuItems.length - 1;
            }
            addActiveClassMenuEl(menuItems, 'dropdown-menu__item--active');
            break;

          case 'ArrowDown':
            index++;
            if (index > menuItems.length - 1) {
              index = 0;
            }
            addActiveClassMenuEl(menuItems, 'dropdown-menu__item--active');
            break;

          case 'Enter':
            deleteActiveClassInArr(menuItems, 'dropdown-menu__item--active');

            if (index > -1) {
              const item = menuItems[index];

              if (item.href) {
                item.click();
              } else {
                item.focus();
              }
            }
            break;
        }
      }
    });
  });
}
