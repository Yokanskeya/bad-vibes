$('#btn-submit').on('click', function (e) {
  e.preventDefault();
  var form = $(this).parents('form');
  var cancelbtn = $('#cancel')
  Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Saved!',
        text: '',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
      form.submit()
    } else if (result.isDenied) {
      Swal.fire({
        title: 'Changes are not saved',
        text: '',
        icon: 'info',
        showConfirmButton: false,
        timer: 1500
      })
      cancelbtn.click();
    }
  })
});