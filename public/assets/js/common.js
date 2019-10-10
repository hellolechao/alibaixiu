 //  - 找到退出按钮，给这个按钮注册点击事件
 // - 查看接口文档，找到退出功能的接口
 // - 调用ajax进行网络请求
 // - 当退出成功，执行success的函数，在里面执行跳转到登录页面的功能
 // - 当退出失败，执行error函数，提示用户
 $('#logout').on('click', function() {
     // alert('退出')
     $.ajax({
         url: '/logout',
         type: 'post',
         success: function() {
             location.href = 'login.html'
         },
         error: function() {
             alert('退出失败')
         }
     })
 })