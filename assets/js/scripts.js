let list_buttons = [];

$(() => {

	list_buttons = [
		$('.menu-button .menu-trigger'),
		$('.button-call-back span'),
		$('.user-top .icon-user'),
		$('.cart-top .cart-wr'),
	]


	// Слайдер в шапке
	slider_top($('.top-slider-wr .slider-list'));
	// Всплывающее меню
	popup_menu_top();
	// Плавающая шапка
	positionMenu();

	// Слайдер в заказах
	sliderOrder($('.list-product-order .list'));

	// Сладер категорий
	slick_slider_folder($('.folder-slider-list:not(.not-slider)'))

	// Слайдер ресторана
	if($('.slider-restoran .list .item').length){
		$('.slider-restoran .list').slick({
			dots: true,
			arrows: false,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
		})
	}

	// Форма обратный звонок
	$('.phones-top span.call-back, .button-call-back span').on('click', function () {
		$(this).toggleClass('opened');
		popup_form('callback', $(this));
		return false;
	})
	// Выбор города
	$('.city-icon').on('click', function () {
		popup_form('city-select', $(this));
		return false;
	})
	// Форма промокод
	$('a.promo-popup').on('click', function () {
		popup_form('promo-form', $(this));
		return false;
	})
	// Форма регистрации авторизации
	$('.user-top:not(.avtorized) .icon-user').on('click', function () {
		$(this).toggleClass('opened');
		popup_form('user-entry', $(this));
		return false;
	})

	$('.user-top.avtorized .icon-user').on('click', function () {
		alert('Выход из авторизации, делаем что то когда пользователь выходит из авторизации');
		return false;
	})

	// Форма восстановить пароль
	$('a.restore-pass').on('click', function () {
		popup_form('user-restore');
		setTimeout(() => {
			$('.user-top .icon-user').addClass('opened');
		}, 301)
		return false;
	})
	// Форма восстановления пароля, кода пришел ответ на запрос по емаил
	$('a.user-restore-pass').on('click', function () {
		popup_form('user-restore-pass');
		return false;
	})
	// Форма новая регистрация
	$('a.new-registration').on('click', function () {
		popup_form('user-new-registration', null, afterOpenRegistration);
		setTimeout(() => {
			$('.user-top .icon-user').addClass('opened');
		}, 301)
		return false;
	})

	function afterOpenRegistration(el){

		let $p = $('.form-user-new-registration form');
		let $name = $p.find('input[name="name-user"]');
		let $email = $p.find('input[name="email"]');
		let $pass = $p.find('input[name="pass"]');
		let $passRep = $p.find('input[name="pass-repeat"]');
		let isValid = true;

		$pass.on('input', function (){
			if($(this).val().length < 8){
				setErrorString($(this), 'Минимальная длина поля должна быть не меньше 8 символов');
				isValid = false;
			} else {
				unSetErrorString($(this));
				isValid = true;
				if(!passEqual($pass, $passRep)){
					setErrorString($(this), 'Пароли не совпадают');
					isValid = false;
				} else {
					unSetErrorString($passRep);
					unSetErrorString($(this));
					isValid = true;
				}
			}
		})
		$passRep.on('input', function (){
			if($(this).val().length < 8){
				setErrorString($(this), 'Минимальная длина поля должна быть не меньше 8 символов');
				isValid = false;
			} else {
				unSetErrorString($(this));
				isValid = true;
				if(!passEqual($pass, $passRep)){
					setErrorString($(this), 'Пароли не совпадают');
					isValid = false;
				} else {
					unSetErrorString($(this));
					unSetErrorString($pass);
					isValid = true;
				}
			}
		})


		$('.form-user-new-registration form').on('submit', function (){

			if(!$name.val()){
				isValid = false;
				setErrorString($name, 'Пожалуйста, заполните поле');
			} else {
				unSetErrorString($name);
				isValid = true;
			}

			let isValidEmail = validateEmail($email);
			isValid = isValid && isValidEmail;

			if($pass.val().length < 8){
				isValid = false;
				setErrorString($pass, 'Минимальная длина поля должна быть не меньше 8 символов');
			}

			if($passRep.val().length < 8) {
				isValid = false;
				setErrorString($passRep, 'Минимальная длина поля должна быть не меньше 8 символов');
			}
			if(!passEqual($pass, $passRep)){
				setErrorString($passRep, 'Пароли не совпадают');
			}

			if(!isValid){
				return false;

			}

			$(this).submit();

			return false;
		})
	}

	function setErrorString(el, text){
		let errorString = $(`<small class="note">${text}</small>`);
		if(!el.next(errorString).length){
			el.after(errorString);
			el.addClass('error')
			errorString.show();
			el.parent('.form-row').addClass('error');
		}
	}
	function unSetErrorString(el){
		el.next().remove();
		el.parent('.form-row').removeClass('error');
	}
	function validateEmail(el) {
		let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test(el.val()) === false) {
			setErrorString(el, 'Пожалуйста, введите корректный адрес электронной почты')
			return false;
		} else {
			unSetErrorString(el);
			return true;
		}
	}

	function passEqual($p1, $p2){
		if($p1.val() === $p2.val()){
			return true;
		} else {
			return false;
		}
	}

	// Всплывающая корзина
	cart_popup()

	$('.menu-folder-mobile').on('click', function () {
		popup_form('menu-mobile', $(this));
		return false;
	})


	// Закрытие форм
	$('.pop-close-button').on('click', function () {
		$(this).parents('.popup-wrap').fadeOut(200);
		$('.block-overlay').fadeOut(0);
	})

	// Выбор города мобильный
	resizeController([-Infinity, 639], function () {
		$('.form-city-select .title').on('click', function () {
			$(this).parents('.popup-wrap').find('.pop-close-button').click();
			$('.header .menu-trigger').removeClass('opened');
			setTimeout(() => {
				$('.header .menu-trigger').trigger('click');
			}, 300)
		})
	})

	// Меню выбора категорий мобильный
	$('.menu-list-folders .menu-list-title').on('click', function () {
		$('.popup-wrap').fadeOut(0, function () {
			$('html').removeClass('hidden-scroll');
			removeOpenClass();
		})
		setTimeout(() => {
			$('.header .menu-trigger').trigger('click');
		}, 300)
	})

	// Меню выбора категорий мобильный
	$('.menu-list-folders a.item-menu').on('click', function () {
		let subList = $(this).next('ul');

		if (subList.length) {
			let li_parent = $(this).parent('li');
			li_parent.siblings('li').hide();
			li_parent.addClass('active');
			li_parent.find('>ul').show();
			$(this).parents('.menu-list-folders').addClass('active');


		} else {
			document.location.href = $(this).attr('href');
		}

		return false;
	})
	// Меню выбора категорий мобильный
	$('ul.sub-list li.title-menu').on('click', function () {
		$(this).parent('ul').hide();
		$(this).parent('ul').parent('li').siblings('li').show();
		$(this).parent('ul').parent('li').removeClass('active');
		$(this).parents('.menu-list-folders').removeClass('active');
		return false;
	})

	// Раскрытие списка товаров в заказе
	$('.line-history .open-ord').on('click', function () {
		$(this).toggleClass('opened');
		$(this).parents('.line-history').find('.list-product-order').slideToggle(100);
	})

	// Блок адресов личный кабинет
	openedAddressList();

	// Блок действий с паролем
	passAction();

	$('.popup-status i').on('click', function () {
		$(this).parent().find('.popup-info-status').slideToggle(200);
	})

	userCabinetController()

	// Всплывающий блок карточки товара
	$('.button-select.buy, .item-product .item-picture').on('click', function () {
		popupCard($(this));
		return false;
	})
	popupCardEvents();

	// Слайдер на странице корзины
	sliderPageCart($('.list-recomended-cart-products .list'));

	$(document).find('.phone-num').each(function () {
		$(this).inputmask("+7(999) 999-99-99", {
			onincomplete: function () {
				if ($(this).val()) {
					$(this).parent().addClass('error');
				}
			},
			oncomplete: function () {
				$(this).parent().removeClass('error');
			}
		});
	})

	tabAction($('.select-delivery-title li'), $('.select-delivery-wrap .item-tab'));

	tabAction($('.list-time-title li'), $('.item-row-time .item-tab .list'));

	tabAction($('.list-pay-title li'), $('.item-row-payment .item-tab .list'));

	if ($.fn.styler) {
		$('.day-delivery, .time-delivery').styler({'selectSearch': false});
	}

	selectReview();

	toggleReviewForm();

	$('button.reserve').on('click', function () {
		popup_form('restoran', $(this));
		return false;
	})

})

function tabAction($t, $i) {
	$t.on('click', function () {
		if($(this).parent('.list-pay-title')){
			if($(this).hasClass('active')){
				$(this).parent('.list-pay-title').addClass('active');
			} else {
				$(this).parent('.list-pay-title').removeClass('active');
			}
		}
		let ind = $(this).index();
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		$i.removeClass('active');
		$i.each(function () {
			if ($(this).index() === ind) {
				$(this).addClass('active');
			}
		})

	})
}

function cart_popup() {
	$('.cart-top .cart-wr').on('click', function () {

		$('.popup-wrap').fadeOut(0, function () {
			$('html').removeClass('hidden-scroll');
			removeOpenClass();
		})

		if ($(this).parent().hasClass('opened')) {
			$(this).parent().removeClass('opened')
			$('.block-overlay').hide();
		} else {
			$(this).parent().addClass('opened')
			if ($(window).width() <= 640) {
				setTimeout(() => {
					$('.block-overlay').show();
				}, 100)
			} else {
				setTimeout(() => {
					$('.block-overlay').hide();
				}, 100)
			}
			sliderRecommeded($('.recommendation-product .list-items'));
		}

		$('.amount-cart-item').each(function () {
			amountRecount($(this));
		})
		$(document).on('click', function (e) {
			if (!$(e.target).closest('.cart-top').length) {
				$('.block-overlay').hide();
				$('.cart-top').removeClass('opened');
			}
		})
	})
	$('.cart-top .cart-popup-wr .close-cart').on('click', function () {
		$('.cart-top').removeClass('opened');
	})
}


function slick_slider_folder(wr) {
	wr.slick({
		dots: false,
		infinite: false,
		speed: 300,
		slidesToShow: 15,
		slidesToScroll: 1,
		swipeToSlide: true,
		responsive: [
			{
				breakpoint: 1800,
				settings: {
					slidesToShow: 14,
				}
			},
			{
				breakpoint: 1700,
				settings: {
					slidesToShow: 13,
				}
			},
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 12,
				}
			},
			{
				breakpoint: 1500,
				settings: {
					slidesToShow: 11,
				}
			},
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 10,
				}
			},
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 9,
				}
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 8,
				}
			},
			{
				breakpoint: 1023,
				settings: {
					slidesToShow: 7,
				}
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 6,
				}
			},
			{
				breakpoint: 800,
				settings: {
					slidesToShow: 5,
				}
			},
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 500,
				settings: {
					slidesToShow: 2,
				}
			},

		]
	});

}

function slider_top(wr) {
	wr.slick({
		dots: true,
		arrows: false,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
	});
}


function sliderRecommeded(wr) {
	if (!wr.hasClass('slick-initialized')) {
		wr.slick({
			dots: false,
			arrows: false,
			infinite: false,
			variableWidth: true
		});
	}
}

function sliderOrder(wr) {
	if (!wr.hasClass('slick-initialized')) {
		wr.slick({
			dots: false,
			arrows: true,
			infinite: false,
			variableWidth: true
		});
	}
}

function sliderPageCart(wr) {
	if (!wr.hasClass('slick-initialized')) {
		wr.slick({
			dots: false,
			arrows: true,
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 901,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 769,
					settings: {
						slidesToShow: 2,
						arrows: false,
					}
				},
				{
					breakpoint: 481,
					settings: {
						slidesToShow: 1,
						arrows: false,
					}
				},
				{
					breakpoint: 0,
					settings: {
						slidesToShow: 1,
						arrows: false,
					}
				},
			]
		});
	}
}


function popup_menu_top() {
	let menu_wr = $('.menu-button');
	let but = $(document).find('.menu-trigger');
	let menu = $(document).find('.menu-top');
	let loc = $(document).find('.header .left-info')
	let phones_top = $(document).find('.phones-top');

	resizeController([-Infinity, 1366], function () {
		menu_wr.find('.menu-popup').append(menu);
	});
	resizeController([1367, Infinity], function () {
		menu_wr.after(menu);
	});

	resizeController([-Infinity, 1023], function () {
		menu_wr.find('.menu-popup').append(loc);
	});
	resizeController([1024, Infinity], function () {
		$('.header .logo').after(loc);
	});

	resizeController([-Infinity, 640], function () {
		menu_wr.find('.menu-popup').append(phones_top);
	});
	resizeController([641, Infinity], function () {
		$('.header .user-top').before(phones_top);
	});


	but.on('click', function () {
		let ov = $('.block-overlay')
		if (but.hasClass('opened')) {
			menu_wr.find('.menu-popup').slideUp(100);
			but.removeClass('opened');
			resizeController([-Infinity, 640], function () {
				ov.fadeOut(0);
			})
			$('.popup-wrap').fadeOut(0, function () {
				$('html').removeClass('hidden-scroll');
				removeOpenClass();
			})
		} else {
			resizeController([-Infinity, 640], function () {
				ov.fadeIn(0);
			})
			menu_wr.find('.menu-popup').slideDown(100);
			but.addClass('opened');
		}
	})

	$(document).on('click', function (e) {
		if (!$(e.target).closest('.menu-button').length) {
			menu_wr.find('.menu-popup').slideUp(100);
			$('.block-overlay').fadeOut(0)

			let promo = $('.popup-wrap[data-popup="promo-form"]').is(':visible');
			let city = $('.popup-wrap[data-popup="city-select"]').is(':visible');
			let menu = $('.popup-wrap[data-popup="menu-mobile"]').is(':visible');
			if (!promo && !city && !menu) {
				but.removeClass('opened');
			}
		}
	})
}

function positionMenu() {
	let header_height = 0, slider_folder_height = 0, header_fantom, header_fix, top = $(window).scrollTop();
	let height_fantom = 0;
	header_fix = $('.site-header-fix');
	header_fantom = $('.header-fantom');
	if (top > 1) {
		header_fix.addClass('is-fixed')
	} else {
		header_fix.removeClass('is-fixed');
	}

	setTimeout(() => {
		header_height = $('.site-header-fix .site-header').outerHeight();
		if ($('.site-header-fix .folder-slider-wrap').length) {
			slider_folder_height = $('.site-header-fix .folder-slider-wrap').outerHeight();
		}

		resizeController([-Infinity, 639], function () {
			slider_folder_height = 0;
		})

		height_fantom = header_height + slider_folder_height;

		header_fantom.css({'height': height_fantom});
	}, 100)

	$(window).scroll(function () {
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function () {
			top = $(window).scrollTop();
			if (top > 1) {
				header_fix.addClass('is-fixed')
			} else {
				header_fix.removeClass('is-fixed')
			}

			header_height = $('.site-header-fix .site-header').outerHeight() || 0;
			slider_folder_height = slider_folder_height = $('.site-header-fix .folder-slider-wrap').length ? $('.site-header-fix .folder-slider-wrap').outerHeight() : 0;
			if (!$('.site-header-fix .folder-slider-wrap').is(':visible')) {
				slider_folder_height = 0
			}
			height_fantom = header_height + slider_folder_height;
			header_fantom.css({'height': height_fantom});
		}, 10));
	});

	$(window).on('resize', function () {
		top = $(window).scrollTop();
		if (top > 1) {
			header_fix.addClass('is-fixed')
		} else {
			header_fix.removeClass('is-fixed')
		}

		header_height = $('.site-header-fix .site-header').outerHeight() || 0;
		slider_folder_height = slider_folder_height = $('.site-header-fix .folder-slider-wrap').length ? $('.site-header-fix .folder-slider-wrap').outerHeight() : 0;

		if (!$('.site-header-fix .folder-slider-wrap').is(':visible')) {
			slider_folder_height = 0
		}

		height_fantom = header_height + slider_folder_height;
		header_fantom.css({'height': height_fantom});
	})
}

function popup_form(target, el, callback) {
	let pop_w = $('.popup-wrap');
	let pop = $('.popup-wrap[data-popup="' + target + '"]');
	let close = pop.find('.pop-close-button');


	$('.cart-top').removeClass('opened');
	$(document).find('.menu-popup').slideUp(100);
	$(document).find('.block-overlay').fadeOut(0);

	if (el && el.parents('.menu-popup').length) {
		$(document).find('.header .menu-trigger').removeClass('opened');
	}

	if (!pop.is(':visible')) {
		pop_w.fadeOut(200, function () {
			$('html').removeClass('hidden-scroll');
			removeOpenClass();
		})
	} else {
		pop.fadeOut(200);
		$('html').removeClass('hidden-scroll');
		removeOpenClass();
		return false;
	}

	$('html').addClass('hidden-scroll');
	pop.fadeIn(200);
	if (el) {
		setTimeout(() => {
			el.addClass('opened');
			if (el.parents('.menu-popup').length) {
				$('.header .menu-trigger').addClass('opened')
			}
		}, 300)
	}

	if (pop.find('.phone-num')) {
		pop.find('.phone-num').each(function () {
			$(this).inputmask("+7(999) 999-99-99", {
				onincomplete: function () {
					if ($(this).val()) {
						$(this).parent().addClass('error');
					}
				},
				oncomplete: function () {
					$(this).parent().removeClass('error');
				}
			});
		})
	}

	if(pop.find('.num').length){
		pop.find('.num').each(function (){
			if($.fn.styler){
				$(this).styler();
			}
		})
	}

	if(pop.find('.datepicker')){
		if($.fn.datepicker){
			pop.find('.datepicker').each(function (){
				$(this).datepicker($.datepicker.regional['ru']);
			})
		}
	}

	close.on('click', function () {
		pop.fadeOut(200);
		$('html').removeClass('hidden-scroll');
		removeOpenClass();
	})
	$(document).on('click', '.popup-block', function (e) {
		if (!$(e.target).closest('.popup-block-inner').length) {
			pop.fadeOut(200);
			$('html').removeClass('hidden-scroll');
			removeOpenClass();

			$('.menu-list-folders, .menu-list-folders .item-folder').removeClass('active');
			$('.menu-list-folders .item-folder, .menu-list-title').show();
		}
	})

	if(typeof callback === 'function'){
		callback.apply(pop_w);
	}

	return false;
}

function amountRecount(item) {
	let plus = item.find('button.amount-plus');
	let minus = item.find('button.amount-minus');
	let item_text = item.find('input[type="text"]');
	let default_step = 1;

	plus.on('click', function () {
		let count = +item_text.val();
		item_text.val(count + default_step);
		return false;
	})
	minus.on('click', function () {
		let count = +item_text.val();
		item_text.val(count - default_step <= 0 ? default_step : count - default_step);
		return false;
	})

	item_text.on('keyup keydown keypress ', function () {
		let v = setInputFilter($(this).val());

		item_text.val(v <= 0 ? default_step : v);
	})
}

function setInputFilter(val) {
	return val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
};

function removeOpenClass() {
	list_buttons.map(function (item) {
		item.removeClass('opened');
	})
}

function passAction() {
	let passForm = $('.cabinet-info');

	passForm.find('.text.show-pass').on('click', function () {
		passForm.find('.info-row.pass-edit').show();
		$(this).parents('.info-row').hide();
	})

	passForm.find('.show-text-pass').on('click', function () {
		let inp = $(this).siblings('input');
		if ($(this).hasClass('not')) {
			$(this).removeClass('not');
			inp.attr('type', 'password')
		} else {
			$(this).addClass('not');
			inp.attr('type', 'text')
		}
	})

	let oldPass = passForm.find('input[name="old_pass"]');
	let new_pass = passForm.find('input[name="new_pass"]');
	let new_pass2 = passForm.find('input[name="new_pass_2"]');

	oldPass.on('keyup change keypress', function () {
		passEq($(this))
	})

	new_pass.on('keyup change keypress', function () {
		passEq($(this), new_pass2)
	})

	new_pass2.on('keyup change keypress', function () {
		passEq($(this), new_pass)
	})

	passForm.find('.save-pass').on('click', function () {
		passForm.find('.info-row.pass-edit').hide();
		passForm.find('.info-row.pass-edit-trigger').show();
		alert('Запуск формы сохранения данных пользователя')
		passForm.submit();
		return false;
	})

	passForm.find('.info-row .info-grey .edit').on('click', function () {
		alert('Запуск формы сохранения данных пользователя')
		passForm.submit();
	})
	passForm.find('.info-row input[type="checkbox"]').on('click', function () {
		alert('Запуск формы сохранения данных пользователя')
		passForm.submit();
	})
}

function passEq(el, eq_el) {
	let min_length = 6;
	let texts = {
		'0': 'Пожалуйста, заполните поле',
		'6': 'Должен cодержать не менее 6 символов',
		'eq': 'Пароли не совпадают'
	}
	let note_el = el.parents('.info-row').find('.note-err');

	if (el.val().length < min_length && el.val().length > 0) {
		note_el.text(texts['6']);
		el.addClass('not-valid');
		note_el.show();
	} else if (el.val().length === 0) {
		note_el.text(texts['0']);
		el.addClass('not-valid');
		note_el.show();
	} else if (eq_el && el.val() !== eq_el.val()) {
		note_el.text(texts['eq']);
		el.addClass('not-valid');
		eq_el.addClass('not-valid');
		note_el.show();
	} else if (eq_el && el.val() === eq_el.val()) {
		el.parents('.info-row').find('.note-err').hide();
		eq_el.parents('.info-row').find('.note-err').hide();
		el.removeClass('not-valid');
		eq_el.removeClass('not-valid');
	} else {
		note_el.hide();
		el.removeClass('not-valid');
	}

	let pas_form = el.parents('form');
	let but_save_pass = el.parents('form').find('.save-pass');
	if (pas_form.find('.not-valid').length) {
		but_save_pass.addClass('has-invalid-fields');
	} else {
		but_save_pass.removeClass('has-invalid-fields');
	}

}


function openedAddressList() {
	let openAddButton = $('.add-address-line');
	let wrAddForm = $('.address-add-form');
	let adrList = $('.address-list');

	openAddButton.on('click', function () {
		wrAddForm.slideToggle(200);
		wrAddForm.toggleClass('opened');
	})

	wrAddForm.find('.delete-data').on('click', function () {
		wrAddForm.find('input[type="text"]').val('');
		wrAddForm.slideUp(200);
		wrAddForm.removeClass('opened');
		return false;
	})
	wrAddForm.find('.add-data').on('click', function () {
		let adr = '';
		wrAddForm.find('input[type="text"]').each(function () {
			let v = $(this).val();
			if (adr == '') {
				adr += v != '' ? v : '-';
			} else {
				adr += v != '' ? ', ' + v : ', -';
			}
		})
		adrList.append(`<li><div class="text-address">${adr}</div><div class="edit-add"></div><div class="delete-add"></div></li>`);
		wrAddForm.slideUp(200);
		wrAddForm.removeClass('opened');
		wrAddForm.find('input[type="text"]').val('');

		return false;
	})

}

function userCabinetController() {
	let infoTop = $('.status-user-name, .line-status-text, .status-sale');
	let titleTab = $('.title-tab');
	resizeController([641, Infinity], function () {
		$('.cabinet-status-line .title-tab').after(infoTop);

		titleTab.each(function () {
			console.log($(this));
			$(this).removeClass('opened');
			$(this).parent().removeClass('opened').removeClass('not-opened');
			$(this).siblings().attr('style', '');
			$(this).off('click');
		})

	})

	resizeController([-Infinity, 640], function () {
		$('.info-user-mob').append(infoTop);

		titleTab.each(function () {
			if (!$(this).hasClass('opened')) {
				$(this).siblings().hide();
				$(this).parent().addClass('not-opened');

				$(this).on('click', function () {
					if ($(this).hasClass('opened')) {
						$(this).parent().addClass('not-opened').removeClass('opened');
						$(this).siblings().each(function () {
							$(this).slideUp(100);
						});
						$(this).removeClass('opened');
					} else {
						$(this).parent().removeClass('not-opened').addClass('opened');
						$(this).siblings().each(function () {

							if (!$(this).hasClass('pass-edit') && !$(this).attr('hidden') && !$(this).hasClass('no-adr-list') && !$(this).hasClass('address-add-form')) {
								$(this).slideDown(100);
							}
						});
						$(this).addClass('opened');
					}
				})

			}
		})
	})
}

function popupCard(el) {

	let pop_w = $('.popup-wrap');
	let pop = $('.popup-wrap[data-popup="shop-card"]');
	let close = pop.find('.pop-close-button');

	if (!pop.is(':visible')) {
		pop_w.fadeOut(200, function () {
			$('html').removeClass('hidden-scroll');
			removeOpenClass();
		})
	} else {
		pop.fadeOut(200);
		$('html').removeClass('hidden-scroll');
		removeOpenClass();
		return false;
	}

	$('html').addClass('hidden-scroll');
	pop.fadeIn(200);

	close.on('click', function () {
		pop.fadeOut(200);
		$('html').removeClass('hidden-scroll');
		removeOpenClass();
	})
	$(document).on('click', '.popup-block', function (e) {
		if (!$(e.target).closest('.popup-block-inner').length) {
			pop.fadeOut(200);
			$('html').removeClass('hidden-scroll');
			removeOpenClass();

			$('.menu-list-folders, .menu-list-folders .item-folder').removeClass('active');
			$('.menu-list-folders .item-folder, .menu-list-title').show();
		}
	})

	return false;
}

function popupCardEvents() {
	$(document).on('click', '.card-popup .icon-info', function () {
		if ($(this).hasClass('opened')) {
			$(this).removeClass('opened');
			$(this).parent().find('.popup-info').slideUp(200);
		} else {
			$(this).addClass('opened');
			$(this).parent().find('.popup-info').slideDown(200);
		}
	})

	// Выбор опции удаление
	$(document).on('click', '.product-info .select-list-option a.del', function () {
		$(this).addClass('repeat').removeClass('del');
		$(this).parent().find('.name').addClass('repeat');
		alert('Что то делаем с удалением опции') // удалить в боевом режиме
		return false;
	})
	// Выбор опции возврат
	$(document).on('click', '.product-info .select-list-option a.repeat', function () {
		$(this).removeClass('repeat').addClass('del');
		$(this).parent().find('.name').removeClass('repeat');
		alert('Что то делаем с возвратом опции') // удалить в боевом режиме
		return false;
	})
	// Выбор радио опции
	$(document).on('click', '.product-info .select-radio-option a', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).parent('li').siblings('li').find('a').removeClass('active');
			$(this).addClass('active');
		}
		alert('Что то делаем с выбором радио опиции'); // удалить в боевом режиме
		return false;
	})

	// выбор дополнительного товара
	$(document).on('click', '.card-set-list .item-set', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).siblings('.item-set').removeClass('active');
			$(this).addClass('active');
		}
		alert('Что то делаем с выбором доп товаров'); // Удалить в боевом режиме
	})

	$('.check-contact .detail-info .icon').on('click', function () {
		if ($(this).parent().hasClass('active')) {
			$(this).next('.detail-pop').fadeOut(200);
			$(this).parent().removeClass('active');
		} else {
			$(this).next('.detail-pop').fadeIn(200);
			$(this).parent().addClass('active');
		}
	})
	$('.row-comment-toggle .name').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).next('.row-com').slideUp(200);
			$(this).removeClass('active');
		} else {
			$(this).next('.row-com').slideDown(200);
			$(this).addClass('active');
		}
	})

	$('.cart-page .amount-cart-item').each(function () {
		amountRecount($(this));
	})

	$(document).on('click', function (e) {
		if (!$(e.target).closest('.detail-info').length) {
			$('.check-contact .detail-info').removeClass('active');
			$('.check-contact .detail-info .detail-pop').fadeOut(200);
		}
	})
}

function selectReview(){
	let $p = $('.form-row.star');
	let $input = $p.find('input');
	let $star = $p.find('.star');

	$star.on('mouseenter', function (){
		let $this = $(this);
		$this.addClass('active');
		$this.prevAll('.star').addClass('active');
		$this.nextAll('.star').removeClass('active');
		let countActive = $this.parent().find('.active').length;
		$input.val(countActive);
	})
}

function toggleReviewForm(){
	$(document).on('click', '.toggle-review span', function (){
		let f = $('.review-form');
		let t = $(this);
		if($(this).hasClass('active')){
			f.slideUp(function (){
				t.removeClass('active');
			})
		} else {
			f.slideDown(function (){
				t.addClass('active');
			})
		}

	})
}

function resizeController() {
	var i = $(window), o = i.width(), n = [], e = [], t = [void 0, void 0];
	if (arguments.length) for (var d = 0; d <= arguments.length - 1; d++) $.isArray(arguments[d]) ? n = arguments[d] : $.isNumeric(arguments[d]) ? n.push(arguments[d]) : $.isFunction(arguments[d]) && e.push(arguments[d]);
	i.resize(function (d) {
		o = i.width(), n.length > 1 ? o >= n[0] && o <= n[n.length - 1] && void 0 === t[0] ? (e[0](), t[0] = !0, t[1] = void 0) : (o < n[0] || o > n[n.length - 1]) && void 0 === t[1] && (t[0] = void 0, t[1] = !0, $.isFunction(e[1]) && e[1]()) : 1 == n.length && (o <= n[0] && void 0 === t[0] ? (e[0](), t[0] = !0, t[1] = void 0) : o > n[0] && void 0 === t[1] && (t[0] = void 0, t[1] = !0, $.isFunction(e[1]) && e[1]()))
	}).trigger("resize")
}