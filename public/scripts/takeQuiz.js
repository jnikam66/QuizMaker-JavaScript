/*

TakeQuiz(oDebug, oApi, oAttributeHelper)
TakeQuiz::SetPageMode(oPageMode)
TakeQuiz::Init()
TakeQuiz::InitCancelChooseQuizButton()
TakeQuiz::InitCancelQuizButton()
TakeQuiz::InitStartQuizButton()
TakeQuiz::InitFinishedQuizButton()
TakeQuiz::PopulateQuizList()
TakeQuiz::DoInitializeQuiz(quiz_id)
TakeQuiz::PopulateQuizElements(quiz)
TakeQuiz::ClearQuizElements()
TakeQuiz::DoStartTakeQuiz()
TakeQuiz::ShowFirstQuestion()
TakeQuiz::ChooseQuestionAnswer($button)
TakeQuiz::ShowNextQuestion()
TakeQuiz::ComputeAndShowQuizResults()
TakeQuiz::FindClosestCharacterByAttributes(attributes)

*/

(function() {

  //  Per our convention: Init App
  if (!window.App) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  //  TakeQuiz(oDebug, oApi, oAttributeHelper)
  var TakeQuiz = function TakeQuiz(oDebug, oApi, oAttributeHelper) {

    //
    this.debug = oDebug;
    this.api = oApi;
    this.attributeHelper = oAttributeHelper;

    //
    this.ANIMATION_LENGTH = 250;

    //
    this.selectors = {};
    this.selectors.MAIN = "div#mode-take-quiz";
    this.selectors.QUIZ_CHOOSE = this.selectors.MAIN + " div[data-element-role=choose-quiz]";
    this.selectors.QUIZ_CHOOSE_CANCEL_BUTTON = this.selectors.MAIN + " button[data-button-role=cancel]";
    this.selectors.QUIZZES = this.selectors.QUIZ_CHOOSE + " ul[data-element-role=quiz-list]";
    this.selectors.QUIZ = this.selectors.MAIN + " div[data-element-role=quiz]";
    this.selectors.QUIZ_START_BUTTON = this.selectors.MAIN + " button[data-button-role=quiz-start]";
    this.selectors.QUIZ_CANCEL_BUTTON = this.selectors.MAIN + " button[data-button-role=quiz-cancel]";
    this.selectors.QUIZ_FINISHED_BUTTON = this.selectors.MAIN + " button[data-button-role=quiz-done]";
    this.selectors.QUIZ_TITLE = this.selectors.MAIN + " header[data-element-role=quiz-title]";
    this.selectors.QUIZ_DESCRIPTION = this.selectors.MAIN + " p[data-element-role=quiz-description]";
    this.selectors.QUIZ_QUESTIONS_CONTAINER = this.selectors.MAIN + " ul[data-element-role=quiz-questions]";
    this.selectors.QUIZ_QUESTIONS = this.selectors.QUIZ_QUESTIONS_CONTAINER + " li[data-element-role=quiz-question]";
    this.selectors.QUIZ_QUESTION = "li[data-element-role=quiz-question]";
    this.selectors.QUIZ_QUESTIONS_VISIBLE = this.selectors.QUIZ_QUESTIONS + ":visible";
    this.selectors.QUIZ_QUESTIONS_FIRST = this.selectors.QUIZ_QUESTIONS_CONTAINER + " li:first";
    this.selectors.QUIZ_QUESTION_ANSWERS_CONTAINER = "ul[data-element-role=quiz-question-answers]";
    this.selectors.QUIZ_QUESTION_ANSWERS = this.selectors.QUIZ_QUESTION_ANSWERS_CONTAINER + " li[data-element-role=quiz-question-answer]";
    this.selectors.QUIZ_RESULTS_CONTAINER = this.selectors.MAIN + " ul[data-element-role=quiz-results]";
    this.selectors.QUIZ_RESULTS = this.selectors.QUIZ_RESULTS_CONTAINER + " li[data-element-role=quiz-result-character]";
  };

  //  TakeQuiz::SetPageMode(oPageMode)
  TakeQuiz.prototype.SetPageMode = function SetPageMode(oPageMode) {
    this.pageMode = oPageMode;
  };

  //  TakeQuiz::Init()
  TakeQuiz.prototype.Init = function Init() {

    //
    this.InitCancelChooseQuizButton();
    this.InitStartQuizButton();
    this.InitCancelQuizButton();
    this.InitFinishedQuizButton();
  };

  //  TakeQuiz::InitCancelChooseQuizButton()
  TakeQuiz.prototype.InitCancelChooseQuizButton = function InitCancelChooseQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_CHOOSE_CANCEL_BUTTON).click(function() {
      $("#services").removeClass("hide");
      oThis.pageMode.ClearMode();
    });
  };

  //  TakeQuiz::InitCancelQuizButton()
  TakeQuiz.prototype.InitCancelQuizButton = function InitCancelQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_CANCEL_BUTTON).click(function() {
      $("#services").removeClass("hide");
      oThis.pageMode.ClearMode();
    });
  };

  //  TakeQuiz::InitStartQuizButton()
  TakeQuiz.prototype.InitStartQuizButton = function InitStartQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_START_BUTTON).click(function() {

      //
      oThis.DoStartTakeQuiz();
    });
  };

  //  TakeQuiz::InitFinishedQuizButton()
  TakeQuiz.prototype.InitFinishedQuizButton = function InitFinishedQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_FINISHED_BUTTON).click(function() {
      $("#services").removeClass("hide");
      //
      $(oThis.selectors.QUIZ_FINISHED_BUTTON).fadeOut(oThis.ANIMATION_LENGTH, function() {
        oThis.pageMode.ClearMode();
      });

    });
  };

  //  TakeQuiz::PopulateQuizList()
  TakeQuiz.prototype.PopulateQuizList = function PopulateQuizList() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ).hide();
    this.ClearQuizElements();

    //
    oThis.api.GetAllQuizzes(function(quizzes) {

      //
      var $ul = $(oThis.selectors.QUIZZES);

      //  First, clear out previous data
      $ul.html("");

      //  Populate with each quiz
      $.each(quizzes, function(index, quiz) {

        //
        var $li = $(document.createElement("li"));
        //
        var $button = $(document.createElement("button"));
        $button.attr({
          "data-button-role": "quiz-button",
          "data-quiz-id": quiz["id"]
        });
        $button.addClass("btn btn-primary");
        $button.html(quiz["title"]);
        $button.click(function() {

          //
          var $button = $(this);

          //
          oThis.DoInitializeQuiz($button.attr("data-quiz-id"));
        });
        $li.append($button);

        //
        $ul.append($li);
      });

      //
      $ul.show();
      $(oThis.selectors.QUIZ_CHOOSE).show();
    });
  };

  //  TakeQuiz::DoInitializeQuiz(quiz_id)
  TakeQuiz.prototype.DoInitializeQuiz = function DoInitializeQuiz(quiz_id) {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_CHOOSE).fadeOut(oThis.ANIMATION_LENGTH, function() {

      //
      oThis.api.GetQuiz(quiz_id, function(quiz) {

        //
        oThis.PopulateQuizElements(quiz);
        $(oThis.selectors.QUIZ).fadeIn(oThis.ANIMATION_LENGTH);
      });
    });
  };

  //  TakeQuiz::PopulateQuizElements(quiz)
  TakeQuiz.prototype.PopulateQuizElements = function PopulateQuizElements(quiz) {

    //
    var oThis = this;

    //  Clear DOM
    this.ClearQuizElements();

    //  Title and description
    $(oThis.selectors.QUIZ_TITLE).html(quiz["title"]).show();
    $(oThis.selectors.QUIZ_DESCRIPTION).html(quiz["description"]).show();

    //  QUESTIONS
    $.each(quiz["questions"], function(question_index, question) {

      //
      var $question = $(document.createElement("li")).attr({
        "data-element-role": "quiz-question"
      });
      $question.hide();

      //  Question's title
      $question.append(
        $(document.createElement("header")).html(question["title"]).attr({
          "data-element-role": "quiz-question-header"
        })
      );
      //  Question's text
      $question.append(
        $(document.createElement("p")).html(question["text"]).attr({
          "data-element-role": "quiz-question-text"
        })
      );

      //  Answers
      var $answers = $(document.createElement("ul")).attr({
        "data-element-role": "quiz-question-answers"
      });
      $.each(question["answers"], function(answer_index, answer) {

        //  Answer is a list item
        var $answer = $(document.createElement("li")).attr({
          "data-element-role": "quiz-question-answer",
          "data-answer-attribute-modifiers": answer["attributemodifiers"]
        });

        //  Button inside the answer li, holds the text
        $answer.append(
          $(document.createElement("button")).html(answer["text"]).attr({
            "data-element-role": "answer-select-button"
          }).addClass("btn btn-info").click(function() {
            oThis.ChooseQuestionAnswer($(this));
          })
        );

        //
        $answers.append($answer);
      });
      $question.append($answers);

      //
      $(oThis.selectors.QUIZ_QUESTIONS_CONTAINER).append($question);
    });

    //  Result Characters
    $.each(quiz["characters"], function(character_index, character) {

      //
      var $character = $(document.createElement("li")).attr({
        "data-element-role": "quiz-result-character",
        "data-character-attributes": character["attributes"]
      });

      //  Title
      $character.append(
        $(document.createElement("header")).attr({
          "data-element-role": "quiz-result-character-title"
        }).html(character["title"])
      );

      //  Description
      $character.append(
        $(document.createElement("p")).attr({
          "data-element-role": "quiz-result-character-description"
        }).html(character["description"])
      );

      //
      $(oThis.selectors.QUIZ_RESULTS_CONTAINER).append($character);
    });

    //
    $(oThis.selectors.QUIZ_START_BUTTON).fadeIn(oThis.ANIMATION_LENGTH);
    $(oThis.selectors.QUIZ_CANCEL_BUTTON).fadeIn(oThis.ANIMATION_LENGTH);
  };

  //  TakeQuiz::ClearQuizElements()
  TakeQuiz.prototype.ClearQuizElements = function ClearQuizElements() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_TITLE).html("");
    $(oThis.selectors.QUIZ_DESCRIPTION).html("");

    //
    $(oThis.selectors.QUIZ_QUESTIONS_CONTAINER).html("").hide();
    $(oThis.selectors.QUIZ_RESULTS_CONTAINER).html("").hide();
  };

  //  TakeQuiz::DoStartTakeQuiz()
  TakeQuiz.prototype.DoStartTakeQuiz = function DoStartTakeQuiz() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_TITLE).fadeOut(oThis.ANIMATION_LENGTH, function() {
      oThis.ShowFirstQuestion();
    });
    $(oThis.selectors.QUIZ_DESCRIPTION).fadeOut(oThis.ANIMATION_LENGTH);
    $(oThis.selectors.QUIZ_START_BUTTON).fadeOut(oThis.ANIMATION_LENGTH);

  };

  //  TakeQuiz::ShowFirstQuestion()
  TakeQuiz.prototype.ShowFirstQuestion = function ShowFirstQuestion() {

    //
    var oThis = this;

    //
    $(oThis.selectors.QUIZ_QUESTIONS_FIRST).show();
    $(oThis.selectors.QUIZ_QUESTIONS_CONTAINER).fadeIn(oThis.ANIMATION_LENGTH);
  };

  //  TakeQuiz::ChooseQuestionAnswer($button)
  TakeQuiz.prototype.ChooseQuestionAnswer = function ChooseQuestionAnswer($button) {

    //
    var oThis = this;

    //  Grab attribute modifiers from the answer parenting this button
    var attribute_modifiers = $button.closest(oThis.selectors.QUIZ_QUESTION_ANSWERS).first().attr("data-answer-attribute-modifiers");

    //  Locate the parent question, and set attributes
    $button.closest(oThis.selectors.QUIZ_QUESTIONS).attr({
      "data-chosen-attribute-modifiers": attribute_modifiers
    });

    //  Show the next question
    oThis.ShowNextQuestion();
  };

  //  TakeQuiz::ShowNextQuestion()
  TakeQuiz.prototype.ShowNextQuestion = function ShowNextQuestion() {

    //
    var oThis = this;

    //
    var $question_visible = $(oThis.selectors.QUIZ_QUESTIONS_VISIBLE);
    var $question_next = $question_visible.next(oThis.selectors.QUIZ_QUESTION);

    //
    $question_visible.fadeOut(oThis.ANIMATION_LENGTH, function() {

      //
      if ($question_next.length) {
        $question_next.fadeIn(oThis.ANIMATION_LENGTH);
      } else {
        oThis.ComputeAndShowQuizResults();
      }
    });
  };

  //  TakeQuiz::ComputeAndShowQuizResults()
  TakeQuiz.prototype.ComputeAndShowQuizResults = function ComputeAndShowQuizResults() {

    //
    var oThis = this;

    //  Attributes to calculate
    var attributes = {};

    //  Sum up all attribute modifiers
    $(oThis.selectors.QUIZ_QUESTIONS).each(function() {

      //
      var $question = $(this);

      //
      var attribute_modifiers = $question.attr("data-chosen-attribute-modifiers");
      oThis.attributeHelper.ApplyAttributeModifiers(attributes, attribute_modifiers);
    });

    //  Grab the character container with the closest attributes
    var $character;
    try {
      $character = oThis.FindClosestCharacterByAttributes(attributes);
    } catch (e) {
      oThis.debug.DoError("FindClosestCharacterByAttributes() failed!: " + e);
      return false;
    }

    //
    $(oThis.selectors.QUIZ_RESULTS).hide();
    $(oThis.selectors.QUIZ_CANCEL_BUTTON).fadeOut(oThis.ANIMATION_LENGTH);
    $(oThis.selectors.QUIZ_RESULTS_CONTAINER).fadeIn(oThis.ANIMATION_LENGTH, function() {

      //
      $character.fadeIn(oThis.ANIMATION_LENGTH);
      $(oThis.selectors.QUIZ_FINISHED_BUTTON).fadeIn(oThis.ANIMATION_LENGTH);
    });
  };

  //  TakeQuiz::FindClosestCharacterByAttributes(attributes)
  TakeQuiz.prototype.FindClosestCharacterByAttributes = function FindClosestCharacterByAttributes(attributes) {

    //
    var oThis = this;

    //  Grab all result character containers, and compare attributes
    var $characters = $(oThis.selectors.QUIZ_RESULTS);
    var $character_chosen = null;
    var character_chosen_distance = 0;
    $.each($characters, function(index, character) {

      //
      var $character = $(character);

      //
      var character_attributes_string = $character.attr("data-character-attributes");
      var character_attributes;
      try {
        character_attributes = oThis.attributeHelper.ParseAttributes(character_attributes_string);
      } catch (e) {
        oThis.debug.DoError("FindClosestCharacterByAttributes() - Failed to ParseAttributes()");
        throw e;
      }

      //
      var distance = oThis.attributeHelper.ComputeCharacterAttributeDistance(attributes, character_attributes);
      if ($character_chosen == null || distance < character_chosen_distance) {
        $character_chosen = $character;
        character_chosen_distance = distance;
      }
    });

    //
    return $character_chosen;
  };

  //  Assign our TakeQuiz class to the window App
  window.App.TakeQuiz = TakeQuiz;

})();