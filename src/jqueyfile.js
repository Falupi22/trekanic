$(document).ready(function(){
    $('.modal').modal('show');
});

var myModal = document.getElementsByClassName('modal')[0]

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})