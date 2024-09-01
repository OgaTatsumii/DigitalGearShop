const confirm_delete = document.querySelector(".confirmDelete");
const confirm_cancel = document.querySelector(".confirmCancel");
const delete_production_modal = document.querySelectorAll(
    ".deleteProductionModal"
);
const modal1 = document.querySelector(".modal1");
const iconClose2 = document.querySelector(".close2");
// const iconCloseCancel = document.querySelector(".closeCancel");
const denied = document.querySelector(".denied");
// const deniedCancel = document.querySelector(".deniedCancel");
const accept = document.querySelector("#btn-delete-user");

console.log(delete_production_modal);
console.log(confirm_delete);
console.log(modal1);

delete_production_modal.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

iconClose2.addEventListener("click", () => {
    confirm_delete.classList.remove("active");
    modal1.classList.remove("active");
});

iconClose2.addEventListener("click", () => {
    confirm_cancel.classList.remove("active");
    modal1.classList.remove("active");
});

denied.addEventListener("click", () => {
    confirm_delete.classList.remove("active");
    modal1.classList.remove("active");
});

denied.addEventListener("click", () => {
    confirm_cancel.classList.remove("active");
    modal1.classList.remove("active");
});

// iconCloseCancel.addEventListener("click", () => {
//     confirm_cancel.classList.remove("active");
//     modal1.classList.remove("active");
// });

// deniedCancel.addEventListener("click", () => {
//     confirm_cancel.classList.remove("active");
//     modal1.classList.remove("active");
// });

// ------------Confirm delete Production--------------

const deleteBtns = document.querySelectorAll(".deleteProductionModal");

const deleteConfirm = document.querySelector("#btn-delete-user");
const deleteForm = document.forms["delete-user-form"];
let userId;
var length = deleteBtns.length;

// console.log(deleteBtns);

// deleteBtns.forEach((dpm) => {
//     dpm.addEventListener("click", () => {
//         confirm_delete.classList.add("active");
//         modal1.classList.add("active");
//     });
// });



for (var i = 0; i < length; i++) {
    deleteBtns[i].onclick = function (e) {
        userId = this.getAttribute("data-id");
        const value = this.getAttribute("value");
        console.log(userId); // dùng để kiểm tra id
        console.log(value); // dùng để kiểm tra id
        deleteConfirm.onclick = function (e) {
            
                if (value === 'true') {
                    e.preventDefault();
                    alert("Không thể xóa sản phẩm đã có trong giỏ hàng");
                } else {
                    deleteForm.action = `/production/${userId}?_method=DELETE`;
                    deleteForm.submit();
                }
            
        };
    };
}

// ------------Confirm forceDelete Production--------------
const fDeleteBtns = document.querySelectorAll(".fDeleteProductionModal");
const fDeleteConfirm = document.querySelector("#btn-fDelete-user");
const forceDeleteForm = document.forms["forceDelete-user-form"];
var length2 = fDeleteBtns.length;

fDeleteBtns.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < length2; i++) {
    fDeleteBtns[i].onclick = function (e) {
        userId = this.getAttribute("data-id");
        console.log(userId); // dùng để kiểm tra id
        fDeleteConfirm.onclick = function (e) {
            forceDeleteForm.action = `/production/${userId}/force?_method=DELETE`;
            forceDeleteForm.submit();
        };
    };
}

// ------------------Confirm delete Account----------------

const deleteBtns2 = document.querySelectorAll(".deleteProductionModal2");
const deleteConfirm2 = document.querySelector("#btn-delete-user-2");
const deleteForm2 = document.forms["delete-user-form-2"];
let userId2;
var length3 = deleteBtns2.length;

deleteBtns2.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < length3; i++) {
    deleteBtns2[i].onclick = function (e) {
        userId2 = this.getAttribute("data-id");
        console.log(userId2); // dùng để kiểm tra id
        deleteConfirm2.onclick = function (e) {
            deleteForm2.action = `/admin/${userId2}?_method=DELETE`;
            deleteForm2.submit();
        };
    };
}

// ------------------Confirm delete Items In Cart----------------
const deleteBtns3 = document.querySelectorAll(".deleteProductionModal3");

const deleteConfirm3 = document.querySelector("#btn-delete-user-3");
const deleteForm3 = document.forms["delete-user-form-3"];
let userId3;
var length4 = deleteBtns3.length;

deleteBtns3.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < length4; i++) {
    deleteBtns3[i].onclick = function (e) {
        userId3 = this.getAttribute("data-id");
        console.log(userId3); // dùng để kiểm tra id
        deleteConfirm3.onclick = function (e) {
            deleteForm3.action = `/cart/${userId3}?_method=DELETE`;
            deleteForm3.submit();
        };
    };
}

// ------------------Confirm softdelete Order----------------

const deleteBtns4 = document.querySelectorAll(".deleteProductionModal4");

const deleteConfirm4 = document.querySelector("#btn-delete-user-4");
const deleteForm4 = document.forms["delete-user-form-4"];
let userId4;
var length4 = deleteBtns4.length;

deleteBtns4.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < length4; i++) {
    deleteBtns4[i].onclick = function (e) {
        userId4 = this.getAttribute("data-id");
        console.log(userId4); // dùng để kiểm tra id
        deleteConfirm4.onclick = function (e) {
            deleteForm4.action = `/admin/${userId4}/order?_method=DELETE`;
            deleteForm4.submit();
        };
    };
}

// ------------------Confirm forcedelete Order----------------
const fDeleteBtnsOrder = document.querySelectorAll(
    ".fDeleteProductionModalOrder"
);
const fDeleteConfirmOrder = document.querySelector("#btn-fDelete-user-order");
const forceDeleteFormOrder = document.forms["forceDelete-user-form-order"];
var length5 = fDeleteBtnsOrder.length;

fDeleteBtnsOrder.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_delete.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < length5; i++) {
    fDeleteBtnsOrder[i].onclick = function (e) {
        userId = this.getAttribute("data-id");
        console.log(userId); // dùng để kiểm tra id
        fDeleteConfirmOrder.onclick = function (e) {
            forceDeleteFormOrder.action = `/production/order/${userId}/force?_method=DELETE`;
            forceDeleteFormOrder.submit();
        };
    };
}

// ------------Confirm cancel Order

const cancelButton = document.querySelectorAll(".cancelButton");
console.log(cancelButton);

const cancelConfirm = document.querySelector("#btn-delete-user-cancel");
const cancelForm = document.forms["cancel-user-form"];
let userCancel;
var lengthCancel = cancelButton.length;

cancelButton.forEach((dpm) => {
    dpm.addEventListener("click", () => {
        confirm_cancel.classList.add("active");
        modal1.classList.add("active");
    });
});

for (var i = 0; i < lengthCancel; i++) {
    cancelButton[i].onclick = function (e) {
        userCancel = this.getAttribute("data-id");
        situation = this.getAttribute("situation");
        console.log(userCancel); // dùng để kiểm tra id
        cancelConfirm.onclick = function (e) {
            cancelForm.action = `/admin/${userCancel}/cancelOrder?_method=PUT`;

            cancelForm.submit();
        };
    };
}
