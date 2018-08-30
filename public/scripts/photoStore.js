(function(){
  if ( !window.App ) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  var PhotoStore = new function PhotoStore(oDebug){
    this.debug = oDebug;
  };

  PhotoStore.prototype.addQuizPhoto = function addQuizPhoto(){

  }

  PhotoStore.prototype.addQuestionPhoto = function addQuestionPhoto(){

  }

  PhotoStore.prototype.addCharacterPhoto = function addCharacterPhoto(){

  }

  window.App.PhotoStore = PhotoStore;
});
