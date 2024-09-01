document.getElementById("image").addEventListener("change", function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("preview-image").src = e.target.result;
    document.getElementById("preview-image").style.display = "block";
  };
  reader.readAsDataURL(this.files[0]);
});

const inputElement = document.querySelector("#descImage");
const previewElement = document.querySelector("#preview-image-2");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  const fileList = this.files;

  // previewElement.innerHTML = "";
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        const imageElement = document.createElement("img");
        const imageWrapper = document.createElement("div");
        const removeButton = document.createElement("div");

        imageElement.addEventListener("load", function () {
          const removeButtons = document.querySelectorAll(
            "#remove-image-button"
          );
          removeButtons.forEach(function (removeButton) {
            removeButton.addEventListener("click", function () {
              const imageWrapper = removeButton.parentNode;
              // 
              
              imageWrapper.remove();
              // Loại bỏ phần tử imageWrapper khỏi form
              formElement.removeChild(imageWrapper);
            });
          });
        });

        imageWrapper.classList.add("imgWrapper");
        removeButton.id = "remove-image-button";
        removeButton.innerHTML =
          '<ion-icon name="close-circle-outline"></ion-icon>';

        imageElement.src = this.result;
        imageElement.alt = file.name;
        imageElement.classList.add("detailImg");
        imageElement.style.display = "inline-block";
        imageElement.style.width = "100px";
        imageElement.style.height = "100px";
        imageElement.style.marginRight = "10px";
        imageElement.style.marginTop = "20px";

        imageWrapper.appendChild(imageElement);
        imageWrapper.appendChild(removeButton);
        previewElement.appendChild(imageWrapper);
      },
      false
    );

    reader.readAsDataURL(file);
  }
}

const removeButtons = document.querySelectorAll("#remove-image-button");
removeButtons.forEach(function (removeButton) {
  removeButton.addEventListener("click", function () {
    const imageWrapper = removeButton.parentNode;
    imageWrapper.remove();
    // Loại bỏ phần tử imageWrapper khỏi form
    formElement.removeChild(imageWrapper);
  });
});




