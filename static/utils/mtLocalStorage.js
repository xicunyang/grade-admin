layui.define([], function (exports) {

  exports("mtLocalStorage",{
    saveDataToLocal: function (data) {
      var storage = window.localStorage;
      Object.keys(data).forEach((key) => {
        storage[key] = data[key];
      })
    },

    readDataFromLocal: function (key) {
      var storage = window.localStorage;
      return storage[key];
    },

    clearDataFromLocal: function (key) {
      var storage = window.localStorage;
      storage.removeItem(key);
    }
  })
});

// /**
//  * 将data存到localStorage本地.
//  * @param data
//  */
// var mtLocalStorage = {
//   saveDataToLocal: function (data) {
//     var storage = window.localStorage;
//     Object.keys(data).forEach((key) => {
//       storage[key] = data[key];
//     })
//   },
//
//   readDataFromLocal: function (key) {
//     var storage = window.localStorage;
//     return storage[key];
//   },
//
//   clearDataFromLocal: function (key) {
//     var storage = window.localStorage;
//     storage.removeItem(key);
//   }
//
// }
