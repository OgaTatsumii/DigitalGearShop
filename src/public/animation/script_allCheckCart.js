var checkAll = document.querySelector("#check-all");
var itemCheck = document.querySelectorAll('input[name="productIds[]"]');
var checkAllSubmit = document.querySelector('.btn-check-all-submit');
var paymentForm = document.getElementById('payment-form');

// checkbox all click
checkAll.addEventListener("change", function () {
    var isCheckedAll = this.checked;
    itemCheck.forEach(function (item) {
        item.checked = isCheckedAll;
    });
    renderCheckAllSubmit();
});

// item check change
itemCheck.forEach(function (item) {
    item.addEventListener("change", function () {
        var checkedItems = document.querySelectorAll('input[name="productIds[]"]:checked');
        var isCheckedAll = checkedItems.length === itemCheck.length;
        checkAll.checked = isCheckedAll;
        renderCheckAllSubmit();
    });
});

// check all submit button clicked
checkAllSubmit.addEventListener('click', function(e) {
    e.preventDefault();

    var isSubmittable = !this.classList.contains('disabled');
    if (isSubmittable){
        paymentForm.submit();
    }
});

// re-render checked all
function renderCheckAllSubmit() {
    var checkedCount = document.querySelectorAll('input[name="productIds[]"]:checked').length;
    if (checkedCount > 0) {
        checkAllSubmit.classList.remove('disabled');
    } else {
        checkAllSubmit.classList.add('disabled');
    }
}



    // Lắng nghe sự kiện click của checkbox
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const productId = this.dataset.id; // Lấy giá trị id từ thuộc tính data-id

            // Tìm input hidden trong form và cập nhật giá trị
            const form = document.getElementById('payment-form');
            const input = form.querySelector('input[name="id"]');
            if (this.checked) {
                input.value += productId + ','; // Thêm id vào giá trị hiện tại nếu checkbox được chọn
            } else {
                input.value = input.value.replace(productId + ',', ''); // Xóa id khỏi giá trị nếu checkbox không được chọn
            }
        });
    });


    var checkAll = document.querySelector("#check-all");
    var productCheckboxes = document.querySelectorAll('.product-checkbox');
    var hiddenInput = document.querySelector('input[name="id"]');
    
    checkAll.addEventListener("change", function () {
        var isCheckedAll = this.checked;
        var selectedProductIds = [];
    
        productCheckboxes.forEach(function (checkbox) {
            checkbox.checked = isCheckedAll;
            if (isCheckedAll) {
                selectedProductIds.push(checkbox.value);
            } else {
                selectedProductIds = [];
            }
        });
        selectedProductIds.push("");
        hiddenInput.value = selectedProductIds.join(',');
    });
    
    productCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            var checkedProductIds = [];
    
            productCheckboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    checkedProductIds.push(checkbox.value);
                }
            });
    
            // hiddenInput.value = checkedProductIds.join(',');
        });
    });
    



