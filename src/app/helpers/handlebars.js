const Handlebars = require("handlebars");
const blobUtil = require("blob-util");
const moment = require('moment');

function createImageFileObjectFromUrl(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        return response.arrayBuffer().then((arrayBuffer) => {
          const mimeType = response.headers.get("content-type");
          const extension = mimeType.split("/")[1];
          const timestamp = Date.now();
          const filename = `image_${timestamp}.${extension}`;
  
          const fileObject = {
            name: filename,
            type: mimeType,
            buffer: Buffer.from(arrayBuffer),
          };
  
          return fileObject;
        });
      });
  }
  

Handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });
  

module.exports = {
    sum: (a, b) => a + b,
    gt: function (value1, value2) {
      if (value1 > value2) {
        return true;
      }
      else {
        return false;
      }
    },

    gte: function (value1, value2) {
      if (value1 >= value2) {
        return true;
      }
      else {
        return false;
      }
    },

    lt: function (value1, value2) {
      if (value1 < value2) {
        return true;
      }
      else {
        return false;
      }
    },

    lte: function (value1, value2) {
      if (value1 <= value2) {
        return true;
      }
      else {
        return false;
      }
    },

    ne: function (value1, value2) {
      if (value1 !== value2) {
        return true;
      } 
      else {
        return false;
      }
    },

    or: function (value1, value2) {
      if (value1 || value2) {
        return true;
      }
      else {
        return false;
      }
    },

    and: function (value1, value2) {
      if (value1 && value2) {
        return true;
      }
      else {
        return false;
      }
    },
    subtract: function (value1, value2) {
      return value1 - value2;
    },
  
    add: function (value1, value2) {
      return value1 + value2;
    },

    eq: function (value1, value2){
      return value1 == value2;
    },
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : "default";

      const icons = {
          default: "swap-vertical-outline",
          asc: "trending-up-outline",
          desc: "trending-down-outline",
      };
      const types = {
          default: "desc",
          asc: "desc",
          desc: "asc",
      };
      const icon = icons[sortType];
      const type = types[sortType];

      const address = Handlebars.escapeExpression(
          `?_sort&column=${field}&type=${type}`
      );
      const output = `<a href="${address}">
              <ion-icon name="${icon}"></ion-icon>
          </a>`;
      return new Handlebars.SafeString(output);
  } ,
  sortInstatistic: function (field, sort, req) {
    const sortType = field === sort.column ? sort.type : "default";

    const icons = {
        default: "swap-vertical-outline",
        asc: "trending-up-outline",
        desc: "trending-down-outline",
    };
    const types = {
        default: "desc",
        asc: "desc",
        desc: "asc",
    };
    const icon = icons[sortType];
    const type = types[sortType];

    let address;
    if (req) {
        const searchParams = new URLSearchParams(req.query);
        searchParams.set("column", field);
        searchParams.set("type", type);
        address = `/admin/statistic?_sort&${searchParams.toString()}`;
    } else {
        address = `?_sort&column=${field}&type=${type}`;
    }

    const output = `<a href="${address}">
        <ion-icon name="${icon}"></ion-icon>
    </a>`;
    return new Handlebars.SafeString(output);
  },
    formatCurrency: (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    },
    formatDate:(date) =>{
      
        return moment(date).format('DD/MM/YYYY [Lúc] HH:mm:ss');
      
    },
    formatDateInput(date) {
      // Kiểm tra nếu date không hợp lệ hoặc không phải kiểu Date
      return moment(date).format('DD/MM/YYYY');
    },
    renderImage: async (url) => {
        const file = await createImageFileObjectFromUrl(url);
        const blob = blobUtil.createBlob([file.buffer], { type: file.type });
        const imageUrl = blobUtil.createObjectURL(blob);
    
        const removeButton = '<div id="remove-image-button"><ion-icon name="close-circle-outline"></ion-icon></div>';
      
        const imageElement = `
          <img
            src="${imageUrl}"
            alt="${file.name}"
            class="detailImg"
            style="display: inline-block; width: 100px; height: 100px; margin-right: 10px; margin-top: 20px;"
          />
        `;
      
        return imageElement + removeButton;
      },
      checkSituation: (situation) =>{
        if (situation === 'Completed' || situation === 'Failed' || situation === 'Canceled') {
          return true;
        } else {
          return false;
        }
      }
      
};
