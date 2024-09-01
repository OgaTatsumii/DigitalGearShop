// function showChangePassword() {
//     // Hiển thị hai dòng nhập liệu cho mật khẩu mới và xác nhận mật khẩu mới
//     var enterInput = document.getElementsByClassName("enter-input");
//     for (var i = 0; i < passwordChangeFields.length; i++) {
//         enterInput[i].style.display = "block";
//     }
// }

// // Lắng nghe sự kiện khi nhấp vào "Đổi mật khẩu"
// var statisticButton = document.querySelector(".statistics-according-to-option");
// statisticButton.addEventListener("click", enterInputStatisticOption);

// const confirm_delete2 = document.querySelector(".confirmDelete");
// const delete_production_modal2 = document.querySelectorAll(
//     ".deleteProductionModal"
// );


function handleStatisticOptionChange() {
  const selectElement = document.getElementById('statisticOption');
  const selectedOption = selectElement.value;

  // Ẩn tất cả các div chứa ô input
  const enterInputDivs = document.getElementsByClassName('enter-input');
  for (let i = 0; i < enterInputDivs.length; i++) {
    enterInputDivs[i].style.display = 'none';
  }

  // Hiển thị div chứa ô input tương ứng với option được chọn
  const selectedEnterInputDiv = document.getElementsByClassName(`enter-input-option-${selectedOption}`)[0];
  if (selectedEnterInputDiv) {
    selectedEnterInputDiv.style.display = 'block';
  }

  // Hiển thị hoặc ẩn nút "Thống kê" tùy thuộc vào lựa chọn
  const statisticButton = document.getElementById('statisticButton');
  if (statisticButton) {
    statisticButton.style.display = selectedOption !== '' ? 'block' : 'none';
  }
}














  