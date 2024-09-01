function showChangePassword() {
    // Hiển thị hai dòng nhập liệu cho mật khẩu mới và xác nhận mật khẩu mới
    var passwordChangeFields = document.getElementsByClassName("password-change");
    for (var i = 0; i < passwordChangeFields.length; i++) {
        passwordChangeFields[i].style.display = "block";
    }
}

// Lắng nghe sự kiện khi nhấp vào "Đổi mật khẩu"
var changePasswordButton = document.querySelector(".change-password");
changePasswordButton.addEventListener("click", showChangePassword);

const confirm_delete2 = document.querySelector(".confirmDelete");
const delete_production_modal2 = document.querySelectorAll(
    ".deleteProductionModal"
);

  




function logOut() {
    window.location.href = "/logout";
}


function handleTabClick(tab) {
    
    var tabItems = document.getElementsByClassName("profile-tab-item");

    // Xóa class "active" khỏi tất cả các tab
    for (var i = 0; (i < tabItems.length); i++) {
        tabItems[i].classList.remove("active");
    }

    // Thêm class "active" vào tab được nhấp vào
    var selectedTab = document.querySelector(".profile-tab-item[data-tab='" + tab + "']");
    selectedTab.classList.add("active");

    switch (tab) {
        case 'details':
            // Thực hiện hành động khi nhấp vào tab "Chi tiết tài khoản"
            break;
        case 'orders':
            // Thực hiện hành động khi nhấp vào tab "Đơn hàng của tôi"
            break;
        case 'avatar':
            // Thực hiện hành động khi nhấp vào tab "Đổi ảnh đại diện"
            break;
        case 'password':
            // Thực hiện hành động khi nhấp vào tab "Đổi mật khẩu"
            break;
        default:
            break;
    }
}