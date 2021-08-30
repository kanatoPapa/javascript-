"use strict";

jQuery(function ($) {
  // この中であればWordpressでも「$」が使用可能になる
  $('.p-lineup__text').each(function () {
    var $target = $(this); // オリジナルの文章を取得する

    var html = $target.html(); // 対象の要素を、高さにautoを指定し非表示で複製する

    var $clone = $target.clone();
    $clone.css({
      display: 'none',
      position: 'absolute',
      overflow: 'visible'
    }).width($target.width()).height('auto'); // DOMを一旦追加

    $target.after($clone); // 指定した高さになるまで、1文字ずつ消去していく

    while (html.length > 0 && $clone.height() > $target.height()) {
      html = html.substr(0, html.length - 1);
      $clone.html(html + '...');
    } // 文章を入れ替えて、複製した要素を削除する


    $target.html($clone.html());
    $clone.remove();
  });
  var topBtn = $('.p-lineup__head');
  topBtn.hide(); // ボタンの表示設定

  $(window).scroll(function () {
    if ($(this).scrollTop() > 70) {
      // 指定px以上のスクロールでボタンを表示
      topBtn.fadeIn();
    } else {
      // 画面が指定pxより上ならボタンを非表示
      topBtn.fadeOut();
    }
  }); // ボタンをクリックしたらスクロールして上に戻る

  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 300, 'swing');
    return false;
  }); //ドロワーメニュー

  $("#js_c-gnav__btn").click(function () {
    // $(".l-drawer-menu").toggleClass("is-show");
    // $(".p-drawer-menu").toggleClass("is-show");
    $(this).toggleClass("is-open"); // $(".drawer-menu").toggleClass("open");
    // $("html").toggleClass("is-fixed");
  }); // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動)

  $(document).on('click', 'a[href*="#"]', function () {
    var time = 400;
    var header = $('header').innerHeight();
    var target = $(this.hash);
    if (!target.length) return;
    var targetY = target.offset().top - header;
    $('html,body').animate({
      scrollTop: targetY
    }, time, 'swing');
    return false;
  });
});