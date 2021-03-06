
//items/new 商品出品カテゴリセレクトボックス↓
$(document).on('turbolinks:load', function(){
  $(function(){
    // カテゴリーセレクトボックスのオプションを作成
    function appendOption(category){
      var html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`;
      return html;
    }
    // 子カテゴリーの表示作成
    function appendChidrenBox(insertHTML){
      var childSelectHtml = '';
      childSelectHtml = `<div class='category__choose__added' id= 'children_wrapper'>
                          <div class='category__choose1'>
                            <select class="category__choose--select" id="child_category" name="item[category_id]">
                              <option value="---" data-category="---">必須：選択してください</option>
                              ${insertHTML}
                            <select>
                          </div>
                        </div>`;
      $('.category__choose').append(childSelectHtml);
    }

    // 孫カテゴリーの表示作成
    function appendGrandchidrenBox(insertHTML){
      var grandchildSelectHtml = '';
      grandchildSelectHtml = `<div class='category__choose__added' id= 'grandchildren_wrapper'>
                                <div class='category__choose2'>
                                  <select class="category__choose--select" id="grandchild_category" name="item[category_id]">
                                    <option value="---" data-category="---">必須：選択してください</option>
                                    ${insertHTML}
                                  </select>
                                </div>
                              </div>`;
      $('.category__choose').append(grandchildSelectHtml);
    }

    // 親カテゴリー選択後のイベント
    $('#parent_category').on('change', function(){
      var parent_category_id = document.getElementById('parent_category').value; 
      //選択された親カテゴリーの名前を取得
      if (parent_category_id != "---"){ //親カテゴリーが初期値でないことを確認
        $.ajax({
          url: '/items/category/get_category_children',
          type: 'GET',
          data: { parent_id: parent_category_id },
          dataType: 'json'
        })
        .done(function(children){
          $('#children_wrapper').remove(); //親が変更された時、子以下を削除する
          $('#grandchildren_wrapper').remove();
          var insertHTML = '';
          children.forEach(function(child){
            insertHTML += appendOption(child);
          });
          appendChidrenBox(insertHTML);
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#children_wrapper').remove(); //親カテゴリーが初期値になった時、子以下を削除する
        $('#grandchildren_wrapper').remove();
      }
    });

    // 子カテゴリー選択後のイベント
    $('.category__choose').on('change','#child_category', function(){
      var child_category_id = $('#child_category option:selected').val(); //選択された子カテゴリーのidを取得
      console.log(child_category_id);
      if (child_category_id != "---"){ //子カテゴリーが初期値でないことを確認
        $.ajax({
          url: '/items/category/get_category_grandchildren',
          type: 'GET',
          data: { child_id: child_category_id },
          dataType: 'json'
        })
        .done(function(grandchildren){
          if (grandchildren.length != 0) {
            $('#grandchildren_wrapper').remove(); //子が変更された時、孫以下を削除する
            var insertHTML = '';
            grandchildren.forEach(function(grandchild){
              insertHTML += appendOption(grandchild);
            });
            appendGrandchidrenBox(insertHTML);
          }
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#grandchildren_wrapper').remove(); //子カテゴリーが初期値になった時、孫以下を削除する
      }
    });
  });
});

//header/indexドロップリスト
$(document).on('turbolinks:load', function(){
  $(".category__search").hover(function(){
    $(".category__parent").show(500);
    $(".category__parent").mouseleave(function(){
      $(this).hide(500);
  });
  $(".title li ul").hide(500);
    $(".title li").hover(function() {
        $(">ul:not(:animated)", this).stop(true, true).slideDown("500");
        $(">a", this).addClass("active");
      }, function() {
        $(">ul:not(:animated)", this).slideUp("500");
        $(">a", this).removeClass("active");
      });
  });
});