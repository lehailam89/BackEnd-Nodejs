//Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]');
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener('click', () => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("btn-add-friend");
            
            socket.emit("CLIENT_ADD_FRIEND", userId)
        });
    });
}
//End chức năng gửi yêu cầu

//Chức năng huỷ gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
if (listBtnCancelFriend && listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.remove('add')
      const userId = button.getAttribute('btn-cancel-friend')
      
      socket.emit('CLIENT_CANCEL_FRIEND', userId)
    })
  })
}
//End chức năng huỷ gửi yêu cầu