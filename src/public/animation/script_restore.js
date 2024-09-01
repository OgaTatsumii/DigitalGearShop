// --------------Restore------------------
const restoreBtn = document.querySelectorAll(".btn-restore");
const restoreForm = document.forms["restore-delete-production"];
var lengthRs = restoreBtn.length;

for (var i = 0; i < lengthRs; i++) {
    restoreBtn[i].onclick = function (events) {
        events.preventDefault();
        userId = this.getAttribute("data-id");
        console.log(userId);
        restoreForm.action = `/production/${userId}/restore?_method=PATCH`;
        restoreForm.submit();
    };
}
