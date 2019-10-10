 //   *- 为添加用户功能的每一个表单项添加name属性，且name属性值需要和接口文档中要求的参数名称保持一致
 //   - 找到users.html，找到对应的表单，表单的id为：userForm
 //   - 给单选框设置value值，未激活是0，激活是1
 //   - 注意添加的name值要跟接口文档中的一致，否则后台会获取不到相应的数据
 //   - 超级管理员添加value值：admin；普通用户添加value值：normal
 // *- 为表单绑定提交事件，在事件处理函数中阻止表单默认提交的行为
 //   - return false;
 // *- 在事件处理函数中获取到用户在表单中输入的内容
 // *- 调用添加用户接口，将获取到的内容通过接口发送给服务器端
 //   - 操作成功刷新页面
 //   - 操作失败给出用户提示

 //添加用户、修改用户
 $('#userForm').on('submit', function() {

     var formData = $(this).serialize()

     if ($('.btn-primary').text() == '添加') {
         $.ajax({
             url: '/users',
             type: 'post',
             data: formData,
             success: function() {
                 location.reload()
             },
             error: function() {
                 alert('添加失败')
             }
         })
         return false;
     }
     if (!$('#avatar').val()) {
         //  console.log(formData)
         formData = formData.replace('avatar=&', '')
             //  console.log(formData)
     }
     //  console.log($('#preview').attr('id1'))
     //  console.log(1)
     //  alert('1')

     $.ajax({
         url: '/users/' + $('#preview').attr('id1'),
         type: 'put',
         data: formData,
         success: function() {
             location.reload()
         },
         error: function() {
             alert('修改失败')
         }
     })

     return false;
 })

 // * - 为文件选择控件添加onchange事件，在事件处理函数中获取到用户选择到的文件
 //   - 找到文件域控件  <input id="avatar" type="file">
 // *- 创建formData对象用于实现图片文件上传
 // *- 调用图片文件上传接口，实现图片上传
 //   - 告诉ajax方法，不需要解析请求参数，因为我们上次的图片属于一个二进制形式，设置一个属性即可 processData: false
 //   - 告诉ajax方法，不需要添加参数类型，设置一个属性即可 contentType: false
 //   - 上传成功后，需要把选择的图片显示在页面上
 // *- 在添加新用户表单中新增一个隐藏域，将图片地址存储在隐藏域中
 //   - 因为上传头像是走的单独的接口，我们头像需要跟这个用户进行绑定，所以我们需要在提交的时候携带这个参数

 //上传头像
 $('#avatar').on('change', function() {
     var formData = new FormData()
     formData.append('avatar', this.files[0])
     $.ajax({
         url: '/upload',
         type: 'post',
         data: formData,
         processData: false,
         // 告诉$.ajax方法不要设置请求参数的类型
         contentType: false,
         success: function(a) {
             $('#preview').attr('src', a[0].avatar)
             $('#hiddenAvatar').val(a[0].avatar)
         }
     })
 })


 //更新列表
 $.ajax({
     url: '/users',
     type: 'get',
     async: false,
     success: function(a) {

         var html = template('userlisttpl', {
             msg: a
         })
         $('#userlist').html(html)


     }
 })

 //修改用户
 function modify() {
     $('.text-center>.btn-default').on('click', function() {
         $('#password').css({ display: 'none' })
             //  alert('/users/:' + this.id)
         $('#preview').attr('id1', this.id)
         $.ajax({
             url: '/users/' + this.id,
             type: 'get',
             success: function(a) {
                 //  console.log(a)

                 if (a.avatar) {
                     $('#preview').attr('src', a.avatar)
                 } else {
                     $('#preview').attr('src', '../assets/img/default.png')
                 }

                 $('#email').val(a.email)
                 $('#nickName').val(a.nickName)
                 if (a.status) {
                     $('#jihuo').attr('checked', 'checked')
                 } else {
                     $('#weijihuo').attr('checked', 'checked')
                 }
                 if (a.role == 'admin') {
                     $('#admin').attr('checked', 'checked')
                 } else {
                     $('#normal').attr('checked', 'checked')
                 }
                 $('.btn-primary').text('修改')
             }
         })
     })
 }

 modify()


 //删除用户
 $('.text-center>.btn-danger').on('click', function() {
     //  confirm('delete')
     if (confirm('delete?')) {
         // yes
         //  confirm(this.id)
         $.ajax({
             url: '/users/' + this.id,
             type: 'delete',
             success: function(a) {

                 location.reload()
             },
             error: function() {
                 alert('删除失败')
             }
         })

     } else {
         // not
         //  confirm('not')
     }
 })

 $('#alluserlist input:first').on('change', function() {
     //  confirm(this.checked)
     if (this.checked) {
         $('.page-action>.btn-danger').show()
     } else {
         $('.page-action>.btn-danger').hide()
     }
     $('#alluserlist input:not(:first)').prop('checked', this.checked)
 })
 $('#alluserlist input:not(:first)').on('change', function() {
     var s = $('#alluserlist input:not(:first)').is(':not(:checked)')
     var s1 = $('#alluserlist input:not(:first)').is(':checked')
         //  console.log(s)
     if (s1) {
         $('.page-action>.btn-danger').show()
     } else {
         $('.page-action>.btn-danger').hide()
     }
     if (!s) {
         //  $('.page-action>.btn-danger').show()
         $('#alluserlist input:first').prop('checked', true)
     } else {
         //  $('.page-action>.btn-danger').hide()
         $('#alluserlist input:first').prop('checked', false)
     }
 })
 $('.page-action>.btn-danger').on('click', function() {
     var idCollection = []
         //  c = $('#alluserlist input:checked').parent().parent().find('.btn-danger').attr('href')
     $('#alluserlist input:checked').parent().parent().find('.btn-danger').each(function() {
             //  console.log($(this).attr('id'))
             idCollection.push($(this).attr('id'))
         })
         //  idCollection = idCollection.replace('-', '').trim()
     console.log(idCollection.join('-'))
         //  console.log(idCollection.replace('-', '').trim())
         //  console.log(c)
     $.ajax({
         url: '/users/' + idCollection.join('-'),
         type: 'delete',
         success: function(a) {

             location.reload()
         },
         error: function() {
             alert('删除失败')
         }
     })
 })