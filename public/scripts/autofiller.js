
/*

AutoFiller(oDebug, oPageMode, oMakeQuiz, oTakeQuiz)
AutoFiller::Init()
AutoFiller::InitFillDummyQuizButton()
AutoFiller::MakeDummyQuiz()
AutoFiller::TakeQuiz()

*/

//
(function(){

  //  Our convention is to use window.App for all classes
  if ( !window.App ) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  //  AutoFiller(oMakeQuiz)
  var AutoFiller = function AutoFiller(oDebug, oPageMode, oMakeQuiz, oTakeQuiz) {

    //
    this.debug = oDebug;
    this.pageMode = oPageMode;
    this.makeQuiz = oMakeQuiz;
    this.takeQuiz = oTakeQuiz;

    //  Make SELECTORS
    this.selectors = {};
    this.selectors.FILL_DUMMY_QUIZ_BUTTON = "button[data-button-role=fill-dummy-quiz]";
  };

  //  AutoFiller::Init()
  AutoFiller.prototype.Init = function Init() {

    //
    this.InitFillDummyQuizButton();
  };

  //  AutoFiller::InitFillDummyQuizButton()
  AutoFiller.prototype.InitFillDummyQuizButton = function InitFillDummyQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.FILL_DUMMY_QUIZ_BUTTON).click(function(){
      oThis.MakeDummyQuiz();
    });
  };

  //  AutoFiller::MakeDummyQuiz()
  AutoFiller.prototype.MakeDummyQuiz = function MakeDummyQuiz() {

    //
    var oThis = this;

    //
    var oQuestion;
    var oAnswers;
    var oResults;
    var oResult;

    //  Click to make a quiz
    $(oThis.pageMode.selectors.BUTTON_MAKE_QUIZ).click();

    //  Set title and description
    $(oThis.makeQuiz.selectors.QUIZ_TITLE).val("Example Quiz Title");
    $(oThis.makeQuiz.selectors.QUIZ_DESCRIPTION).val("This is an example description of a quiz");

    //  Add three questions
    for (var question_index = 0; question_index < 3; question_index++) {
      $(oThis.makeQuiz.selectors.ADD_NEW_QUESTION_BUTTON).click();
    }
    //  Add a three answers for each question, but wait a second for the DOM to finish
    for (var answer_index = 0; answer_index < 3; answer_index++) {
      $(oThis.makeQuiz.selectors.ALL_QUESTIONS_NEW_ANSWER_BUTTON).each(function() {
        $(this).click();
      });
    }

    //  Add three quiz result characters
    for (var result_index = 0; result_index < 3; result_index++) {
      $(oThis.makeQuiz.selectors.ADD_NEW_QUIZ_RESULT_CHARACTER_BUTTON).click();
    }

    //  Grab all created questions
    var oQuestions = $(oThis.makeQuiz.selectors.QUESTIONS);

    //  Set first question
    oQuestion = $(oQuestions[0]);
    oAnswers = $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_ANSWERS);
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TITLE).val("Sample Question 1");
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TEXT).val("This is the sample question 1");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 1, for question 1");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=+1;ruthless=+5;greedy=+5;");
    //
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 2, for question 1");
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=+10;ruthless=-5;greedy=-5;");
    //
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sampl answer 3, for question 1");
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=-10;ruthless=+10;greedy=+10;");

    //  Second question
    oQuestion = $(oQuestions[1]);
    oAnswers = $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_ANSWERS);
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TITLE).val("Sample question 2");
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TEXT).val("This is the sample question 2");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 1, for question 2");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=-10;ruthless=+5;greedy=+0;");
    //
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 2, for question 2");
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=-5;ruthless=+10;greedy=+0;");
    //
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 3, for question 2");
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=+0;ruthless=+0;greedy=+10;");

    //  Third question
    oQuestion = $(oQuestions[2]);
    oAnswers = $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_ANSWERS);
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TITLE).val("Sample question 3");
    $(oQuestion).find(oThis.makeQuiz.selectors.QUESTION_TEXT).val("This is the sample question 3");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 1, for question 3");
    $(oAnswers[0]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=+5;ruthless=-10;greedy=+0;");
    //
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 2, for question 3");
    $(oAnswers[1]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=-5;ruthless=-2;greedy=+5;");
    //
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_TEXT).val("Sample answer 3, for question 3");
    $(oAnswers[2]).find(oThis.makeQuiz.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val("good=-10;ruthless=+10;greedy=+5;");

    //  Grab quiz result characters
    oResults = $(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTERS);

    //  Add a result character: Sample 1
    oResult = $(oResults[0]);
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_TITLE).val("Sample Character Result 1");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_DESCRIPTION).val("Description of sample character result 1");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_ATTRIBUTES).val("good=+20;ruthless=+5;greedy=-20;");

    //  Add a result character: Sample 2
    oResult = $(oResults[1]);
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_TITLE).val("Sample Character Result 2");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_DESCRIPTION).val("Description of sample character result 2");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_ATTRIBUTES).val("good=-20;ruthless=+20;greedy=+20;");

    //  Add a result character: Sample 3
    oResult = $(oResults[2]);
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_TITLE).val("Sample Character Result 3");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_DESCRIPTION).val("Description of sample character result 3");
    $(oResult).find(oThis.makeQuiz.selectors.QUIZ_RESULT_CHARACTER_ATTRIBUTES).val("good=0;ruthless=5;greedy=+10;");
  };

  //  AutoFiller::TakeQuiz()
  AutoFiller.prototype.TakeQuiz = function TakeQuiz() {

    //
    var oThis = this;

    //
    window.setTimeout(function(){

      //
      $(oThis.pageMode.selectors.BUTTON_TAKE_QUIZ).click();
      window.setTimeout(function(){

        //
        $(oThis.takeQuiz.selectors.QUIZZES).find("li button[data-element-role=quiz-button]").first().click();

        //
        window.setTimeout(function(){
          $(oThis.takeQuiz.selectors.QUIZ_START_BUTTON).click();
        }, 1000);

      },1000);

    }, 1000);

  };

  //  Assign the class to our App
  window.App.AutoFiller = AutoFiller;

})();
