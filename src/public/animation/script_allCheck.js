var checkboxAll = document.querySelector("#check-box-all");
var itemCheckbox = document.querySelectorAll('input[name="productionIds[]"]');
var btn = document.querySelector(".allCheck .btn");

// Checkbox all click
checkboxAll.addEventListener("change", function () {
    var isCheckedAll = this.checked;
    itemCheckbox.forEach((item) => {
        item.checked = isCheckedAll;
    });
    renderCheckAllSubmitBtn();
});

// Item checkbox click

itemCheckbox.forEach((item) => {
    item.addEventListener("change", function () {
        var isCheckedAll = true;
        itemCheckbox.forEach(function (item) {
            if (!item.checked) {
                isCheckedAll = false;
            }
        });
        checkboxAll.checked = isCheckedAll;
        renderCheckAllSubmitBtn();
    });
});

// render check all submit btn

function renderCheckAllSubmitBtn() {
    var checkedCount = 0;
    itemCheckbox.forEach(function (item) {
        if (item.checked) {
            checkedCount += 1;
        }
    });
    if (checkedCount > 0) {
        btn.classList.remove("disable");
    } else {
        btn.classList.add("disable");
    }
}

console.log(itemCheckbox);
