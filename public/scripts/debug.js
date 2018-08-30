/*

Debug()
Debug::SetApi(oApi)
Debug::SetLoader(oLoader)
Debug::SetPageMode(oPageMode)
Debug::Init()
Debug::InitResetDataButton()
Debug::InitFillDummyQuizButton()
Debug::DoError(message, data)
Debug::MakeDummyQuiz()
Debug::TakeQuiz()

*/


//
(function() {

  //  Our App convention
  if (!window.App) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  //  Debug()
  var Debug = function Debug() {

    //  Make selectors
    this.selectors = {};
    this.selectors.RESET_DATA_BUTTON = "button[data-button-role=reset-all-data]";
  };

  //  Debug::SetApi(oApi)
  Debug.prototype.SetApi = function SetApi(oApi) {
    this.api = oApi;
  };

  //  Debug::SetLoader(oLoader)
  Debug.prototype.SetLoader = function SetLoader(oLoader) {
    this.loader = oLoader;
  };

  //  Debug::SetPageMode(oPageMode)
  Debug.prototype.SetPageMode = function SetPageMode(oPageMode) {
    this.pageMode = oPageMode;
  };

  //  Debug::Init()
  Debug.prototype.Init = function Init() {

    //
    this.InitResetDataButton();
  };

  //  Debug::InitResetDataButton()
  Debug.prototype.InitResetDataButton = function InitResetDataButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.RESET_DATA_BUTTON).click(function() {

      //
      if (confirm("Are you sure you want to reset all data?")) {
        oThis.loader.ResetEverything();
      }
    });
  };

  //  Debug::DoError(message, data)
  Debug.prototype.DoError = function DoError(message, data) {

    //  For now, just console log
    console.log("Error: ");
    console.log(message);

    //  Use an alert box so the error is more visually apparent
    if (data) {
      alert("Error: " + message + "\r\n\r\n" + JSON.stringify(data, null, 3));
    } else {
      alert("Error: " + message);
    }

    //  Possibly also log the data parameter
    if (data) {
      console.log(data);
    }
  };

  //  Add our Debug class to the App
  window.App.Debug = Debug;

})();