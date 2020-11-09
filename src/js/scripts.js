"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const moreBtn = document.querySelector('.js-more-btn');
    const moreIcon = document.querySelector('.more-btn__icon');
    const resetMetroBtn = document.querySelector('#loc-5');
    const checkMetroTop = document.querySelectorAll('[data-location-top]');
    const hiddenOptions = document.querySelector('.js-hidden-elements');
    const showMoreWidget = document.querySelector('.js-widget-more-btn');
    const btnTitle = document.querySelectorAll('.widget__title');
    const resetFilters = document.querySelector('.js-reset-filters');
    const applyFilters = document.querySelector('.js-apply-filters');
    const form = document.querySelector('.form');

    moreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        moreIcon.classList.add('more-btn__icon_active');
        setTimeout(function () {
            moreIcon.classList.remove('more-btn__icon_active');
        }, 1000)
    })

    resetMetroBtn.addEventListener('change', function () {
        if (resetMetroBtn.checked) {
            checkMetroTop.forEach(function (item) {
                item.checked = false;
            });
            resetMetroBtn.checked = true;
        }
    })

    checkMetroTop.forEach(function (item) {
        item.addEventListener('change', function () {
            if (item.checked) {
                resetMetroBtn.checked = false;
            }
        })
    })

    showMoreWidget.addEventListener('click', function (e) {
        e.preventDefault();
        hiddenOptions.classList.toggle('widget__hidden-elements_showed');
    })

    btnTitle.forEach(function (item) {
        item.addEventListener('click', function (e) {
            this.classList.toggle('widget__title_active');
            e.target.nextElementSibling.classList.toggle('widget__body_hidden')
        })
    });

    resetFilters.addEventListener('click', function (e) {
        e.preventDefault();
        form.reset();
    });

    applyFilters.addEventListener('click', function (e) {
        e.preventDefault();
    });
})