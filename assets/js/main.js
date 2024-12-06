---
exclude_in_search: true
layout: null
---
(function($) {
    'use strict';
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        $('.popover-dismiss').popover({
            trigger: 'focus'
        })
    });

    function bottomPos(element) {
        return element.offset().top + element.outerHeight();
    }
    $(function() {
        var promo = $(".js-td-cover");
        if (!promo.length) {
            return
        }
        var promoOffset = bottomPos(promo);
        var navbarOffset = $('.js-navbar-scroll').offset().top;
        var threshold = Math.ceil($('.js-navbar-scroll').outerHeight());
        if ((promoOffset - navbarOffset) < threshold) {
            $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
        }
        $(window).on('scroll', function() {
            var navtop = $('.js-navbar-scroll').offset().top - $(window).scrollTop();
            var promoOffset = bottomPos($('.js-td-cover'));
            var navbarOffset = $('.js-navbar-scroll').offset().top;
            if ((promoOffset - navbarOffset) < threshold) {
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
            } else {
                $('.js-navbar-scroll').removeClass('navbar-bg-onscroll');
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');
            }
        });
    });
}(jQuery));
(function($) {
    'use strict';
    var Search = {
        init: function() {
            $(document).ready(function() {
                $(document).on('keypress', '.td-search-input', function(e) {
                    if (e.keyCode !== 13) {
                        return
                    }
                    var query = $(this).val();
                    var searchPage = "{{ site.url }}{{ site.baseurl }}/search/?q=" + query;
                    document.location = searchPage;
                    return false;
                });
            });
        },
    };

    Search.init();
}(jQuery));

function toggleIcon(e) {
    const targetRow = e.target.previousElementSibling; // Get the parent row
    const iconCell = targetRow.querySelector('.toggle-icon');
    if (e.type === 'show.bs.collapse') {
      iconCell.textContent = '-';
      targetRow.setAttribute('aria-expanded', 'true');
    } else if (e.type === 'hide.bs.collapse') {
      iconCell.textContent = '+';
      targetRow.setAttribute('aria-expanded', 'false');
    }
  }

  // Get all elements that trigger collapse
  const collapsibleRows = document.querySelectorAll('[data-bs-toggle="collapse"]');

  collapsibleRows.forEach(function (row) {
    const collapseTargetId = row.getAttribute('data-bs-target');
    const collapseTarget = document.querySelector(collapseTargetId);

    // Add event listeners for show and hide events
    collapseTarget.addEventListener('show.bs.collapse', toggleIcon);
    collapseTarget.addEventListener('hide.bs.collapse', toggleIcon);
  });

