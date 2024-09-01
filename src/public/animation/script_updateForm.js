
//   function uploadImagesToCloudinary(imageUrls) {
//     // Thực hiện các xử lý tải lên tại đây
//     // Ví dụ: sử dụng thư viện Axios để gửi yêu cầu Ajax
//     // và tải lên từng ảnh lên Cloudinary
    
//     imageUrls.forEach((imageUrl) => {
//       axios.post("//856816892189661:MLfeIKT0__If58-PVxXbu975pug@duqei8e95", { imageUrl })
//         .then((response) => {
//           // Xử lý phản hồi từ Cloudinary
//           // Ví dụ: lưu lại các thông tin về ảnh đã tải lên
//           const cloudinaryResponse = response.data;
//           // ...
//         })
//         .catch((error) => {
//           // Xử lý lỗi (nếu có)
//           console.error("Error uploading image to Cloudinary:", error);
//         });
//     });
//   }

//   // Lắng nghe sự kiện submit của form
// document.getElementById("updateForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Ngăn chặn việc gửi form theo cách thông thường
    
//     const showImg = document.querySelector("#image");
//     // Lấy danh sách các đường dẫn ảnh
//     const imageElements = document.querySelectorAll("#preview-image-2 img");
//     const imageUrls = Array.from(imageElements).map((image) => image.getAttribute("src"));
//     imageUrls.push(showImg.getAttribute("src"));
//     // Gửi yêu cầu tải lên Cloudinary
//     uploadImagesToCloudinary(imageUrls);
//   });