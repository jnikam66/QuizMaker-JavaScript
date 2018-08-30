/*

PageMode(oDebug, oApi)
PageMode::SetMakeQuiz(oMakeQuiz)
PageMode::SetTakeQuiz(oTakeQuiz)
PageMode::Init()
PageMode::InitModeButtons()
PageMode::ClearMode()
PageMode::SelectMode(mode)

*/

//
(function() {

  //  Our convention is: window.App.[module_name]
  if (!window.App) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  //  PageMode(oDebug, oApi)
  var PageMode = function PageMode(oDebug, oApi) {

    //
    this.debug = oDebug;
    this.api = oApi;

    //
    this.ANIMATION_LENGTH = 250;

    //
    this.selectors = {};
    this.selectors.MODE_CHOOSER = "#mode-chooser";
    this.selectors.MODE_MAKE_QUIZ = "#mode-make-quiz";
    this.selectors.MODE_TAKE_QUIZ = "#mode-take-quiz";
    this.selectors.BUTTON_MAKE_QUIZ = this.selectors.MODE_CHOOSER + " button[data-button-role=mode-chooser][data-mode=make-quiz]";
    this.selectors.BUTTON_TAKE_QUIZ = this.selectors.MODE_CHOOSER + " button[data-button-role=mode-chooser][data-mode=take-quiz]";
  };

  //  PageMode::SetMakeQuiz(oMakeQuiz)
  PageMode.prototype.SetMakeQuiz = function SetMakeQuiz(oMakeQuiz) {
    this.makeQuiz = oMakeQuiz;
  };

  //  PageMode::SetTakeQuiz(oTakeQuiz)
  PageMode.prototype.SetTakeQuiz = function SetTakeQuiz(oTakeQuiz) {
    this.takeQuiz = oTakeQuiz;
  };

  //  PageMode::Init()
  PageMode.prototype.Init = function Init() {
    this.InitModeButtons();
  };

  //  PageMode::InitModeButtons()
  PageMode.prototype.InitModeButtons = function InitModeButtons() {

    //
    var oThis = this;

    //  Mode::Make a Quiz
    $(oThis.selectors.BUTTON_MAKE_QUIZ).click(function() {

      //
      oThis.SelectMode("make-quiz");

      //
      $("html, body").animate({
        scrollTop: $(document).height()
      }, "slow");

    });

    //  Mode::Take a Quiz
    $(oThis.selectors.BUTTON_TAKE_QUIZ).click(function() {

      //
      oThis.SelectMode("take-quiz");

      //
      $("html, body").animate({
        scrollTop: $(document).height()
      }, "slow");
    });
  };

  //  PageMode::ClearMode()
  PageMode.prototype.ClearMode = function ClearMode() {

    //
    var oThis = this;

    //
    $(oThis.selectors.MODE_MAKE_QUIZ).hide(oThis.ANIMATION_LENGTH);
    $(oThis.selectors.MODE_TAKE_QUIZ).hide(oThis.ANIMATION_LENGTH, function() {
      $(oThis.selectors.MODE_CHOOSER).fadeIn(oThis.ANIMATION_LENGTH);
    });
  };

  // PageMode::SelectMode(mode)
  PageMode.prototype.SelectMode = function SelectMode(mode) {

    //
    var oThis = this;

    //
    if (mode != "make-quiz" && mode != "take-quiz") {
      oThis.root.DoError("PageMode::SelectMode() - Invalid Mode: " + mode);
    }

    //
    $(oThis.selectors.MODE_CHOOSER).fadeOut(oThis.ANIMATION_LENGTH, function() {

      //  Make Quiz Mode
      if (mode == "make-quiz") {

        //
        $(oThis.selectors.MODE_MAKE_QUIZ).fadeIn(oThis.ANIMATION_LENGTH, function() {
          $(oThis.makeQuiz.selectors.QUIZ_TITLE).focus();
        });

      }

      //  Take Quiz Mode
      else if (mode == "take-quiz") {

        //
        oThis.takeQuiz.PopulateQuizList();
        $(oThis.selectors.MODE_TAKE_QUIZ).fadeIn(oThis.ANIMATION_LENGTH);
      }

    });
  };

  //  Add our PageMode class to the main App
  window.App.PageMode = PageMode;

})();