
/*
The MIT License (MIT)

Copyright (c) 2016 Pearson plc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


ga_storage._setAccount(''); //Replace with your own
ga_storage._setDomain('none');
ga_storage._trackPageview('/app_open');

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.setup();
    },

	setup: function () {
		;(function($){
			function runIntro () {
				// Update media position every second
				var media_running_time = 0;
				$('#intro-slide-1').show();
				var media_timer = setInterval(function () {
					media_running_time = media_running_time+1;
				    switch (media_running_time) {
						case 5:
							$('#intro-slide-2').fadeIn();
							break;
						case 8:
							$('#intro-slide-3').fadeIn();
							break;
						case 11:
							$('#intro-slide-4').fadeIn();
							break;
						case 14:
							$('#intro-slide-5').fadeIn();
							break;
						case 17:
							$('#intro-slide-6').fadeIn();
							break;
						case 20:
							$('#intro-slide-7').fadeIn();
							break;
						case 23:
							$('#intro-slide-8').fadeIn();
							break;
					}
				}, 1000);
	
				// Audio player
				var mp3_media_src = 'audio/intro.mp3';
				
				var mp3_media = new Audio();
				mp3_media.src = mp3_media_src;
				mp3_media.onended = function () {
					clearInterval(media_timer);
					$('#menu').fadeIn(function (e) {
						playMenuAudio();
					});
				};
				mp3_media.play();
				
				$('#intro-close').click(function(e){
					mp3_media.pause();
					clearInterval(media_timer);
					$('#menu').fadeIn(function (e) {
						playMenuAudio();
					});
	
					e.preventDefault();
					return false;
				});
			}
			runIntro();
			
			function playMenuAudio() {
				// Audio player
				var mp3_media_src = 'audio/language.mp3';
				
				var mp3_media = new Audio();
				mp3_media.src = mp3_media_src;
				mp3_media.onended = function () {};
				mp3_media.play();
			}
			
			$('#language-english-link').click(function(e){
				// Audio player
				var mp3_media_src = 'audio/kiingereza.mp3';
			
				var mp3_media = new Audio();
				mp3_media.src = mp3_media_src;
				mp3_media.onended = function () {
					fillBookMenu('english');
					$('#dashboard').fadeIn();
				};
				mp3_media.play();
			
				e.preventDefault();
				return false;
			});
		
			$('#language-swahili-link').click(function(e){
				// Audio player
				var mp3_media_src = 'audio/kiswahili.mp3';

				var mp3_media = new Audio();
				mp3_media.src = mp3_media_src;
				mp3_media.onended = function () {
					fillBookMenu('swahili');
					$('#dashboard').fadeIn();
				};
				mp3_media.play();
				e.preventDefault();
				return false;
			});
			
			$('#dashboard-close').click(function(e){
				$('#dashboard').fadeOut(function(){
					$('#dashboard').css({'display':'none'});
					//playMenuAudio();
				});
	
				e.preventDefault();
				return false;
			});
			
			function fillBookMenu (language) {
				db.transaction(function (tx) {
					tx.executeSql("SELECT * FROM key_val WHERE k = 'phone_no_sent'", [], function (tx, results) {
						var show_extra = false;
						if (results.rows.length == 1) {
							show_extra = true;
						}
						
						$('.books').html('');
						for (var i=0; i<books.length; i++) {
							if (books[i][0]['language'] == language) {
								var cover = books[i][0];
								var id = books[i][0]['id'];
					
								var level = books[i][0]['level'];
								var type = books[i][0]['type'];
								
								var visibility = books[i][0]['visibility'];
								if (visibility == undefined || visibility == "free" || show_extra == true) {
									var $li = $('<li class="books-book"></li>');
									var $a = $('<a href="#book" data-book="'+i+'" class="books-book-link books-book-level-'+level+' books-book-'+type+'"></a>');
									var $img = $('<img src="book_images/'+id+'.json.images/'+cover.img[0]+'" class="books-book-cover" />');
					
									$li.append($a);
									$a.append($img);
					
									$tmp = $('<div id="tmp">'+cover.extra[0]+'</div>');
									var k = 0;
									$tmp.children().each(function(){
										if (k == 0) {
											icon_html = '';
											if (type == 'interactive') {
												icon_html = '<i class="fa fa-star"></i> ';
											}
											var $h2 = $('<h2 class="books-book-title">'+icon_html+$(this).text()+'</h2>');
											$a.append($h2);
										}
										else {
											var $p = $('<p>'+$(this).text()+'</p>');
											$a.append($p);
										}
										k = k+1;
									});
					
									$('.books').append($li);
								}
							}
						}
				
						$('.books-book-link').click(function(e){
							// load the book content here
							var book_id = $(this).attr('data-book');
							var book = books[book_id];
							var id = book[0]['id'];
							$('.pages').html('');
							var l = 0;
							for (var i=0; i<book.length; i++) {
								var page = book[i];
								var $section = $('<section class="page"></section>');
								$section.addClass('subsection'+l);
								if (l > 0) {
									$section.hide();
								}
								if (page.type == undefined || page.type == 'book' || page.type == 'interactive') {
									if (i == 0) {
										$section.addClass('cover');
									}
									if (i+1 == book.length) {
										$section.addClass('back');
									}
									if (page.img.length > 0) {
										var $img = $('<img src="book_images/'+id+'.json.images/'+page.img[0]+'" class="page-image" />');
										$section.append($img);
									}
									var $div = $('<div class="content"></div>');
									$section.append($div);
									for (var j=0; j<page.extra.length; j++) {
										if (i == 0 && j == 0) {
											$tmp = $('<div id="tmp">'+page.extra[0]+'</div>');
											var k = 0;
											$tmp.children().each(function(){
												if (k == 0) {
													var $h1 = $('<h1>'+$(this).text()+'</h1>');
													$div.append($h1);
												}
												else {
													var $p = $('<p>'+$(this).text()+'</p>');
													$div.append($p);
												}
												k = k+1;
											});
							
											//var $h1 = $('<h1>'+page.extra[j]+'</h1>');
											//$div.append($h1);
										}
										else {
											var $p = $('<p>'+page.extra[j]+'</p>');
											$div.append($p);
										}
									}
									for (var j=0; j<page.text.length; j++) {
										var $p = $('<p>'+page.text[j]+'</p>');
										$div.append($p);
									}
								}
								else {
									$section.addClass(page.type.replace(/\_/g, '-'));
									l = l+1;
									eval(page.type+'(book[0], $section, page.data, l);');
								}
								$('.pages').append($section);
							}
	
							trackBook(book_id);
							$('#book').fadeIn(function(){
								// log start time for this book
								startTimer();
							});
	
							e.preventDefault();
							ga_storage._trackPageview('/book_'+book_id);
				
							return false;
						});
					});
				});
			}

			$('#book-close').click(function(e){
				stopTimer();
	
				$('#book').fadeOut(function(){
					$('#book').hide();
					// log stop time for this book
					untrackBook();
					// scroll to top of #book
					$('#book').css('overflow', 'hidden');
					$('#book').scrollTop(0);
					$('#book').css('overflow', 'auto');
					
					var $new_book = $('<div id="book" class="app-page"></div>');
					$('#book').children().appendTo($new_book);
					$('#book').replaceWith($new_book);
				});
	
				e.preventDefault();
				return false;
			});

			// ------------------------------------------------------------
			// Show/hide stats

			$('#stats-link').click(function(e){
				showTimes();
				$('#stats').fadeIn();
				e.preventDefault();
				return false;
			});

			$('#stats-close').click(function(e){
				$('#stats').fadeOut();
				e.preventDefault();
				return false;
			});

			// ------------------------------------------------------------
			// Book tracking stuff

			var db = openDatabase("inuka", "0.1", "A database of book reading times", 1024 * 1024);
			db.transaction(function (t) {
				t.executeSql("CREATE TABLE IF NOT EXISTS book_timer (id INTEGER PRIMARY KEY ASC, date_id INTEGER, book_id INTEGER, minutes INTEGER)");
			});
			db.transaction(function (t) {
				t.executeSql("CREATE TABLE IF NOT EXISTS book_tests (id INTEGER PRIMARY KEY ASC, date_id INTEGER, book_id INTEGER, question_id INTEGER, is_correct INTEGER)");
			});
			db.transaction(function (tx){
				tx.executeSql('ALTER TABLE book_tests ADD COLUMN the_time CHAR(5)');
			});
			db.transaction(function (t) {
				t.executeSql("CREATE TABLE IF NOT EXISTS key_val (id INTEGER PRIMARY KEY ASC, k CHAR(20), v CHAR(20))");
			});

			var timer = {book_id:null,start:null};

			function trackBook (book_id) {
				timer.book_id = book_id;
				timer.start = null;
			}

			function untrackBook () {
				timer.book_id = null;
				timer.start = null;
			}

			function startTimer () {
				if (timer.book_id != null) {
					timer.start = new Date();
				}
			}

			function stopTimer () {
				if (timer.start != null) {
					var book_id = timer.book_id;
					var now =  new Date();
					var then = timer.start;

					var diff_ms = (now - then); // milliseconds between then & now
					var diff_mins = Math.round(((diff_ms % 86400000) % 3600000) / 60000); // minutes
		
					var minute_offset = then.getMinutes()
					var date = new Date(then);
					date.setHours(0,0,0,0);
					var day_id = Math.round((date.getTime() / 1000) / 60);
					while (diff_mins > 0) {
						var mins_today = 1440;
						if (mins_today > diff_mins) {
							mins_today = diff_mins;
						}
						// ok, got timer.book_id, mins_today and day_id ... store it here
						(function(day_id, book_id, mins_today){
							db.transaction(function (tx) {
								tx.executeSql('INSERT INTO book_timer (date_id, book_id, minutes) VALUES (?, ?, ?)', [day_id, book_id, mins_today], function(){}, function(){});
							});
						})(day_id, book_id, mins_today);

						// update 
						diff_mins = diff_mins - (1440 - minute_offset)
						day_id = day_id + 1440;
						minute_offset = 0;
					}

					timer.start = null;
				}
			}

			document.addEventListener("resume", startTimer, false);
			document.addEventListener("pause", stopTimer, false);
			
			function backKeyDown(e) {
				if ($('#book').is(':visible')) {
					e.preventDefault();
					$('#book-close').click();
				}
				else if ($('#stats').is(':visible')) {
					e.preventDefault();
					$('#stats-close').click();
				}
				else {
				 	navigator.app.exitApp();
				}
			}
			
			document.addEventListener("backbutton", backKeyDown, true);

			function showTimes () {
				// loop last seven days
				var date = new Date();
				date.setHours(0,0,0,0);
				var day_id = Math.round((date.getTime() / 1000) / 60);
				var day = date.getDay();
				for (var i=0; i<7; i++) {		
					switch (day) {
						case 0:
							var day_label = 'Jumapili'; // Sunday
							break;
						case 1:
							var day_label = 'Jumatatu'; // Monday
							break;
						case 2:
							var day_label = 'Jumanne'; // Tuesday
							break;
						case 3:
							var day_label = 'Jumatano'; // Wednesday
							break;
						case 4:
							var day_label = 'Alhamisi'; // Thursday
							break;
						case 5:
							var day_label = 'Ijumaa'; // Friday
							break;
						case 6:
							var day_label = 'Jumamosi'; // Saturday
							break;
					}

					var $node = $('#day'+i);
					var $label = $('#day'+i+' .day-label');
					var $sum = $('#day'+i+' .day-sum');
					$label.text(day_label);
					$sum.text('0');

					// ok, got day_id, do query to get stats
					(function(day_id, $sum){
						db.transaction(function (tx) {
							tx.executeSql("SELECT SUM(minutes) s FROM book_timer WHERE date_id = ?", [day_id], function (tx, results) {
								// got $sum ... put stat here
								var len = results.rows.length, i;
								if (len == 0) {
									$sum.text(0);
								}
								else {
									for (i = 0; i < len; i++){
										if (results.rows.item(i).s == null) {
											$sum.text('0');
										}
										else {
											$sum.text(results.rows.item(i).s);
										}
									}
								}
							});
						});
					})(day_id, $sum);

					day = day - 1;
					if (day < 0) {
						day = 6;
					}
					day_id = day_id - 1440;
				}
				
				
				var date = new Date();
				date.setHours(0,0,0,0);
				var day_id = Math.round((date.getTime() / 1000) / 60);
				(function(day_id){
					db.transaction(function (tx) {
						tx.executeSql("SELECT * FROM book_tests WHERE date_id = ? ORDER BY id ASC", [day_id], function (tx, results) {
							// got $sum ... put stat here
							var len = results.rows.length, i;
							if (len > 0) {
								for (i = 0; i < len; i++){
									var $p = $('<p class="log-line"></p>');
									var $span = $('<span class="db-id"></span>').text(results.rows.item(i).the_time+' ('+results.rows.item(i).id+')');
									$p.append($span);
									var $span = $('<span class="book-id"></span>').text(results.rows.item(i).book_id);
									$p.append($span);
									var $span = $('<span class="question-id"></span>').text('Q'+results.rows.item(i).question_id);
									$p.append($span);
									var is_correct = 'n';
									if (results.rows.item(i).is_correct == 1) {
										var is_correct = 'y';
									}
									var $span = $('<span class="is-correct is-correct-'+is_correct+'"></span>').text(is_correct);
									$p.append($span);
									
									$('#test-log').prepend($p);
								}
							}
						});
					});
				})(day_id);
			}
			
			// ------------------------------------------------------------
			// Assessment stuff
			
			function blockProgression (book, $page, j) {
				var d = new Date();
				var mins = d.getMinutes()+'';
				var pad = "00"
				mins = pad.substring(0, pad.length - mins.length)
				var the_time = d.getHours()+':'+mins;
				
				var date = new Date();
				date.setHours(0,0,0,0);
				var day_id = Math.round((date.getTime() / 1000) / 60);
				(function(day_id, book_id, question_id, is_correct){
					db.transaction(function (tx) {
						tx.executeSql('INSERT INTO book_tests (date_id, book_id, question_id, is_correct, the_time) VALUES (?, ?, ?, ?, ?)', [day_id, book_id, question_id, is_correct, the_time], function(){}, function(){});
					});
				})(day_id, book['id'], j, 0);
			}

			function allowProgression (book, $page, j) {
				$('.subsection'+j).css({opacity:0})
				$('.subsection'+j).show();
				$('.subsection'+j).animate({opacity:'1'}, 400, 'ease-in-out');
				
				var d = new Date();
				var mins = d.getMinutes()+'';
				var pad = "00"
				mins = pad.substring(0, pad.length - mins.length)
				var the_time = d.getHours()+':'+mins;
				
				var date = new Date();
				date.setHours(0,0,0,0);
				var day_id = Math.round((date.getTime() / 1000) / 60);
				(function(day_id, book_id, question_id, is_correct){
					db.transaction(function (tx) {
						tx.executeSql('INSERT INTO book_tests (date_id, book_id, question_id, is_correct, the_time) VALUES (?, ?, ?, ?, ?)', [day_id, book_id, question_id, is_correct, the_time], function(){}, function(transaction, error) {});
					});
				})(day_id, book['id'], j, 1);
			}

			function animateSuccess ($node) {
				// $node.animate({ 'transform': 'scale(1.1)' }, {'duration': 1000, 'easing': 'easeOutBounce'});
				$node.animate({scale:'1.1', 'border-color':'#87c82b', 'color':'#87c82b'}, 200, 'ease-in-out', function(){
					$node.animate({scale:'1'}, 200, 'ease-in-out', function(){});
				});
			}

			function animateFailure ($node) {
				// $node.animate({ 'transform': 'scale(0.9)' }, {'duration': 1000, 'easing': 'easeOutBounce'});
				$node.animate({rotateZ:'5deg'}, 200, 'ease-in-out', function(){
					$node.animate({rotateZ:'-5deg'}, 200, 'ease-in-out', function(){
						$node.animate({rotateZ:'5deg'}, 200, 'ease-in-out', function(){
							$node.animate({rotateZ:'-5deg'}, 200, 'ease-in-out', function(){
								$node.animate({rotateZ:'0deg'}, 200, 'ease-in-out', function(){});
							});
						});
					});
				});
			}

			function q_image_a_text (book, $page, details, j) {
				var $img = $('<img src="book_images/'+book['id']+'.json.images/'+details.q+'" />');
				var $q = $('<div class="question"></div>').append($img);
				$page.append($q);
				var $as = [];
				var $div = $('<div class="answers"></div>');
				$page.append($div);
				for (var i=0; i<details.a.length; i++) {
					var $a = $('<div class="answer"></div>').text(details.a[i]);
					if (i == 0) {
						// Correct answer
						$a.click(function(e){
							animateSuccess($(this));
							setTimeout(function(){
								allowProgression(book, $page, j);
							}, 1000);
				
							e.preventDefault();
							return false;
						});
					}
					else {
						// Incorrect answer
						$a.click(function(e){
							blockProgression(book, $page, j);
							animateFailure($(this));
				
							e.preventDefault();
							return false;
						});
					}
					$as.push($a);
				}
				$as = shuffle($as);
				for (var i=0; i<$as.length; i++) {
					$div.append($as[i]);
				}
			}

			function q_text_a_text (book, $page, details, j) {
				var $q = $('<div class="question"></div>').text(details.q);
				$page.append($q);
				var $as = [];
				var $div = $('<div class="answers"></div>');
				$page.append($div);
				for (var i=0; i<details.a.length; i++) {
					var $a = $('<div class="answer"></div>').text(details.a[i]);
					if (i == 0) {
						// Correct answer
						$a.click(function(e){
							animateSuccess($(this));
							setTimeout(function(){
								allowProgression(book, $page, j);
							}, 1000);
				
							e.preventDefault();
							return false;
						});
					}
					else {
						// Incorrect answer
						$a.click(function(e){
							animateFailure($(this));
							blockProgression(book, $page, j);
				
							e.preventDefault();
							return false;
						});
					}
					$as.push($a);
				}
				$as = shuffle($as);
				for (var i=0; i<$as.length; i++) {
					$div.append($as[i]);
				}
			}

			function q_text_a_image (book, $page, details, j) {
				var $q = $('<div class="question"></div>').text(details.q);
				$page.append($q);
				var $as = [];
				var $div = $('<div class="answers"></div>');
				$page.append($div);
				for (var i=0; i<details.a.length; i++) {
					var $img = $('<img src="book_images/'+book['id']+'.json.images/'+details.a[i]+'" />');
					var $a = $('<div class="answer"></div>').append($img);
					if (i == 0) {
						// Correct answer
						$a.click(function(e){
							animateSuccess($(this));
							setTimeout(function(){
								allowProgression(book, $page, j);
							}, 1000);
				
							e.preventDefault();
							return false;
						});
					}
					else {
						// Incorrect answer
						$a.click(function(e){
							animateFailure($(this));
							blockProgression(book, $page, j);
				
							e.preventDefault();
							return false;
						});
					}
					$as.push($a);
				}
				$as = shuffle($as);
				for (var i=0; i<$as.length; i++) {
					$div.append($as[i]);
				}
			}
			
			function shuffle (array) {
				var currentIndex = array.length, temporaryValue, randomIndex ;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			}
			
			function tryPopup () {
				// Get last popup time, and check if was ok'd or not
				db.transaction(function (tx) {
					tx.executeSql("SELECT * FROM key_val WHERE k = 'phone_no_sent'", [], function (tx, results) {
						if (results.rows.length == 0) {
							db.transaction(function (tx) {
								tx.executeSql("SELECT SUM(minutes) s FROM book_timer", [], function (tx, results) {
									// got $sum ... put stat here
									check_time = 0;
									var len = results.rows.length, i;
									if (len == 0) {
			
									}
									else {
										for (i = 0; i < len; i++){
											if (results.rows.item(i).s == null) {
												check_time = 0;
											}
											else {
												check_time = results.rows.item(i).s;
											}
										}
									}
									db.transaction(function (tx) {
										tx.executeSql("SELECT * FROM key_val WHERE k = 'last_check'", [], function (tx, results) {
											var last_check_time = 0;
											if (results.rows.length == 0) {
												db.transaction(function (tx) {
													tx.executeSql('INSERT INTO key_val (k, v) VALUES (?, ?)', ['last_check', 0], function(){}, function(){});
												});
											}
											else {
												last_check_time = results.rows.item(0).v;
											}
											if (check_time - last_check_time >= 30) {
												// update record with current time
												db.transaction(function (tx) {
													tx.executeSql("UPDATE key_val SET v=? WHERE k=?", [check_time, 'last_check'], function (tx, results) {});
												});
										
												var r = confirm("Tunaona kwamba umekua ukisoma sana! Tungependa kuwasiliana nawe ili tukuulize maswali kuhusu usomaji wako. Ukikubali utapokea vitabu 5 zaidi leo.");
												if (r == true) {
													db.transaction(function (tx) {
														tx.executeSql('INSERT INTO key_val (k, v) VALUES (?, ?)', ['phone_no_sent', 'pending'], function(){}, function(){});
													});
											
												}
												else {}
											}
										});
									});
								});
							});
						}
					});
				});
			}
			setInterval(tryPopup, 30000);

			function onNetworkSendMobileNo () {
				db.transaction(function (tx) {
					tx.executeSql("SELECT * FROM key_val WHERE k = 'phone_no_sent' AND v = 'pending'", [], function (tx, results) {
						if (results.rows.length == 1) {
							// send the number to the server if possible
							window.plugins.sim.getSimInfo(
								function (result) {
									console.log('SENDING NUMBER');
									$.ajax({
										type:'POST',
										url:'http://inukaapp.com/log.php',
										data:{'phone_number': result.countryCode+' '+result.phoneNumber+' ~ '+device.uuid},
										dataType:'json',
										success:function(data){
											// on success ...
											db.transaction(function (tx) {
												tx.executeSql("UPDATE key_val SET v=? WHERE k=?", ['sent', 'phone_no_sent'], function (tx, results) {});
											});
										},
										error:function(xhr, type){}
									});
								},
								function (message) {
									console.log('NUMBER NOT FOUND');
									$.ajax({
										type:'POST',
										url:'http://inukaapp.com/log.php',
										data:{'phone_number': 'number not found ~ '+device.uuid},
										dataType:'json',
										success:function(data){
											// on success ...
											db.transaction(function (tx) {
												tx.executeSql("UPDATE key_val SET v=? WHERE k=?", ['sent', 'phone_no_sent'], function (tx, results) {});
											});
										},
										error:function(xhr, type){}
									});
								}
							);
						}
					});
				});
			}
			setInterval(onNetworkSendMobileNo, 30000);
		})(Zepto)

	}
};			
app.initialize();