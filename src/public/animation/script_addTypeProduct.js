document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("type");
    const addOptionButton = document.createElement("span");
    addOptionButton.innerHTML = '<i class="fas fa-plus"></i>';
    addOptionButton.classList.add("add-option-button");
    
    const selectContainer = selectElement.parentNode;
    selectContainer.appendChild(addOptionButton);
    
    addOptionButton.addEventListener("click", function () {
      const newOption = prompt("Nhập loại sản phẩm mới:");
      
      if (newOption) {
        const option = document.createElement("option");
        option.value = newOption;
        option.text = newOption;
        selectElement.add(option);
        selectElement.value = newOption;
      }
    });
  });