
    $(document).ready(function() {
			"use strict";
			/* SEARCH  */
			/* 2021-07-02 SEARCH  */
			var adaptKeywords = [
				"1.5℃",
				"溫室氣體",
				"八大領域",
				"能力建構",
				"行動論壇",
				"評估報告",
				"TCCIP",
				"NOAA",
				"Adaptation",
				"Temperature",
				"Precipitation",
				"Extreme Weather Events"
		];
		function split(val) {
				return val.split(/,\s*/);
		}
		function extractLast(term) {
				return split(term).pop();
		}
		$("#search_e")
		// don't navigate away from the field on tab 
		// when selecting an item
			.bind("keydown", function (event) {
					if (event.keyCode === $.ui.keyCode.TAB &&
							$(this).data("ui-autocomplete").menu.active) {
							event.preventDefault();
					}
			})
			.autocomplete({
					minLength: 0,
					source: function (request, response) {
							// delegate back to autocomplete, 
							// but extract the last term
							response($.ui.autocomplete.filter(
									adaptKeywords, extractLast(request.term)));
					},
					focus: function () {
							// prevent value inserted on focus
							return false;
					},
					select: function (event, ui) {
							var terms = split(this.value);
							// remove the current input
							terms.pop();
							// add the selected item
							terms.push(ui.item.value);
							// add placeholder to get the 
							//comma-and-space at the end
							terms.push("");
							this.value = terms.join(", ");
							return false;
					}
			});

			$('[data-toggle=search-form]').click(function() {
					$('.search-form-wrapper').toggleClass('open');
					$('.search-form-wrapper .search').focus();
					$('html').toggleClass('search-form-open');
					$('.search-form-tigger').removeClass('cusm-boder');
			});

			$('[data-toggle=search-form-close]').click(function() {
					$('.search-form-wrapper').removeClass('open');
					$('html').removeClass('search-form-open');
					$('.search-form-tigger').toggleClass('cusm-boder');
			});

			$('.dropdown img').hover(function() {
					$('.search-form-wrapper').removeClass('open');
					$('html').removeClass('search-form-open');
					$('.search-form-tigger').toggleClass('cusm-boder');
			});
			var e = jQuery.Event("keydown", { keyCode: 20 });
			$('#search_e').focus(function(){
					$('#search_e').trigger( e );
			});
			$('#search_e').click(function(){
					$('#search_e').trigger( e );
			});
			$('#search-bar').click(function(event) {
					var keyword = $('.search').val();
					$('.search').val(''); //清空欄位
					searchfire(event, keyword);
			});
			$('#adv-search-bar').click(function(event) {
					var keyword = $('.search').val();
					$('.search').val(''); //清空欄位
					advsearchfire(event, keyword);
			});
		});

		$(window).resize(function() {
				"use strict";
				var Gw = $(window),
						Gww = Gw.width(),
						Gwh = Gw.height(),
						Gd = $(document),
						Gdh = Gd.height();
				if (Gww >= 740) {
						$('.height_F').css({ 'min-height': Gwh });
				} else {
						navEventlistener();
				}
				showBackTopbtn();
		});
		
		$(window).scroll(function() {
				"use strict";
				showBackTopbtn();
		});

		function searchfire(event, keyword) {
				event.preventDefault();
				// var sUTL = 'https://cse.google.com/cse?cx=e1273c96f2cf84ab7&as_sitesearch=adapt.epa.gov.tw';
				var sUTL = 'https://www.google.com.tw/search?hl=zh-TW&as_epq=&as_oq=&as_eq=&as_nlo=&as_nhi=&lr=&cr=&as_qdr=all&as_sitesearch=adapt.epa.gov.tw&as_occt=any&safe=images&as_filetype=&tbs=';
				
				if (keyword !== null && keyword !== "") {
						// sUTL = sUTL + '&q=' + keyword;
						sUTL = sUTL + '&as_q=' + keyword;
						// window.open(sUTL, "_blank");
						openURLm("搜尋：" + keyword, sUTL);
						// location.href = sUTL;
				} else {
						$('form').find("input[type=text]").each(function(ev) {
								if (!$(this).val()) {
										$(this).attr("placeholder", "＊ KEYWORD ＊");
								}
						});
				}
		}
		
		function advsearchfire(event, keyword) {
				event.preventDefault();
				var advURL = "https://www.google.com.tw/advanced_search?hl=zh-TW&as_q=&num=100&as_sitesearch=adapt.epa.gov.tw&cof=FORID%3A10&ie=UTF-8&sa=%E6%90%9C%E5%B0%8B&siteurl=www";
				if (keyword !== null && keyword !== "") {
						advURL = advURL + "&q=" + keyword;
				}
				// window.open(advURL, "_blank");
				openURLm("進階搜尋：" + keyword, advURL);
		}

		function showBackTopbtn() {
				var Gw = $(window),
						Gwh = Gw.height(),
						_nowHeight = $(window).scrollTop();
				//backTop BTN show & hide
				if (_nowHeight >= Gwh / 5) { $('.backTop').addClass('action') } else { $('.backTop').removeClass('action'); }
		
		}
		
		function back2Top() {
				$('html,body').animate({ scrollTop: $('#main').offset().top });
		};
		
		function navEventlistener() {
				$('.nav').click(function() {
						$(this).toggleClass('action');
						$('.mainLeft').toggleClass('action');
				});
		}