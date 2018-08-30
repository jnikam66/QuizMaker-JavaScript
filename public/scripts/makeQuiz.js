/*

MakeQuiz(oDebug, oApi, oAttributeHelper)
MakeQuiz::SetPageMode(pageMode)
MakeQuiz::Init()
MakeQuiz::InitForm()
MakeQuiz::InitInstructions()
MakeQuiz::InitCancelButton()
MakeQuiz::InitAddQuestionButton()
MakeQuiz::InitAddQuizResultCharacterButton()
MakeQuiz::InitSubmitQuizButton()
MakeQuiz::HandleFormSubmission()
MakeQuiz::ResetForm(callback)
MakeQuiz::CreateQuestion()
MakeQuiz::CreateQuestionAnswer(question_index, answers_container)
MakeQuiz::CreateQuizResultCharacter()

MakeQuiz::Serializer(oMakeQuiz)
MakeQuiz::Serializer::Serialize()
MakeQuiz::Serializer::SerializeQuestions()
MakeQuiz::Serializer::SerializeQuestionAnswers(oQuestion)
MakeQuiz::Serializer::SerializeQuizResultCharacters()
MakeQuiz::Serializer::ValidateSerializedQuiz(quiz)

*/


//
(function() {

  //  Our convention is: window.App.[module_name]
  if (!window.App) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;

  /*** Start API Class Definition ***/

  //  MakeQuiz(oDebug, oApi, oAttributeHelper)
  var MakeQuiz = function(oDebug, oApi, oAttributeHelper) {

    //
    this.debug = oDebug;
    this.api = oApi;
    this.attributeHelper = oAttributeHelper;

    //
    this.ANIMATION_LENGTH = 250;

    //  SELECTORS !
    this.selectors = {};
    this.selectors.MAIN = "#mode-make-quiz";
    this.selectors.FORM = this.selectors.MAIN + " form";
    this.selectors.SUBMIT_QUIZ_BUTTON = this.selectors.MAIN + " button[data-button-role=\"submit-quiz\"]";
    this.selectors.CANCEL_BUTTON = this.selectors.MAIN + " button[data-button-role=cancel]";
    //
    this.selectors.QUIZ_INSTRUCTIONS = this.selectors.FORM + " div[data-element-role=\"make-quiz-instructions\"]";
    this.selectors.QUIZ_INSTRUCTIONS_BUTTON_SHOW = this.selectors.FORM + " button[data-button-role=\"make-quiz-show-instructions\"]";
    this.selectors.QUIZ_INSTRUCTIONS_BUTTON_HIDE = this.selectors.FORM + " button[data-button-role=\"make-quiz-hide-instructions\"]";
    //
    this.selectors.QUIZ_TITLE = this.selectors.FORM + " input[type=text][name=quiz_title]";
    this.selectors.QUIZ_DESCRIPTION = this.selectors.FORM + " textarea[name=quiz_description]";
    //
    this.selectors.QUESTIONS_CONTAINER = "#mode-make-quiz ul[data-element-role=questions]";
    this.selectors.QUESTIONS = this.selectors.QUESTIONS_CONTAINER + " li[data-element-role=question]";
    this.selectors.ADD_NEW_QUESTION_BUTTON = "#mode-make-quiz button[data-button-role=add-question]";
    this.selectors.QUESTION_TITLE = "input[data-input-role=question-title][type=text][name=title]";
    this.selectors.QUESTION_TEXT = "textarea[data-input-role=question-text][name=text]";
    this.selectors.QUESTION_CLOSEST = "li[data-element-role=question]";
    //
    this.selectors.QUESTION_ANSWERS_CONTAINER = "ul[data-element-role=answers]";
    this.selectors.QUESTION_ANSWERS = "li[data-element-role=answer]";
    this.selectors.ALL_QUESTIONS_NEW_ANSWER_BUTTON = this.selectors.QUESTIONS + " button[data-button-role=add-question-answer]";
    this.selectors.QUESTION_ANSWER_TEXT = "textarea[data-input-role=question-answer-text][name=text]";
    this.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS = "input[type=text][data-input-role=question-answer-attribute-modifiers][name=attribute_modifiers]";
    this.selectors.QUESTION_ANSWER_CLOSEST = "li[data-element-role=answer]";
    this.selectors.QUESTION_ANSWER_LAST = this.selectors.QUESTIONS + " li[data-element-role=answer]:last textarea[data-input-role=question-answer-text]";
    //
    this.selectors.QUIZ_RESULT_CHARACTERS_CONTAINER = this.selectors.FORM + " ul[data-element-role=quiz-result-characters]";
    this.selectors.ADD_NEW_QUIZ_RESULT_CHARACTER_BUTTON = this.selectors.FORM + " button[data-button-role=add-quiz-result]";
    this.selectors.QUIZ_RESULT_CHARACTERS = "li[data-element-role=quiz-result-character]";
    this.selectors.QUIZ_RESULT_CHARACTER_TITLE = "input[type=text][data-element-role=quiz-result-character-title]";
    this.selectors.QUIZ_RESULT_CHARACTER_DESCRIPTION = "textarea[data-element-role=quiz-result-character-description]";
    this.selectors.QUIZ_RESULT_CHARACTER_ATTRIBUTES = "input[type=text][data-element-role=quiz-result-character-attributes]";
    this.selectors.QUIZ_RESULT_CHARACTER_CLOSEST = "li[data-element-role=quiz-result-character]";
    this.serializer = new this.Serializer(this);
  };

  //  MakeQuiz::SetPageMode(_pageMode)
  MakeQuiz.prototype.SetPageMode = function SetPageMode(_pageMode) {

    //
    this.pageMode = _pageMode;
  };

  //  MakeQuiz::Init()
  MakeQuiz.prototype.Init = function Init() {

    //
    this.InitForm();
    this.InitInstructions();
    this.InitCancelButton();
    this.InitAddQuestionButton();
    this.InitAddQuizResultCharacterButton();
    this.InitSubmitQuizButton();
  };

  //  MakeQuiz::InitForm()
  MakeQuiz.prototype.InitForm = function InitForm() {

    //
    var oThis = this;

    //  When the form submits
    $(oThis.selectors.FORM).submit(function(e) {

      //
      oThis.HandleFormSubmission();

      e.preventDefault();
    });

    //  Prevent Quiz Title from submitting on enter
    $(oThis.selectors.QUIZ_TITLE).keypress(event, function() {
      if (event.which == "13") {
        event.preventDefault();
      }
    });
  };

  //  MakeQuiz::InitInstructions()
  MakeQuiz.prototype.InitInstructions = function InitInstructions() {

    //
    var oThis = this;

    //  Init the show-instructions button
    $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_SHOW).click(function(event) {

      //
      $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_SHOW).fadeOut(oThis.ANIMATION_LENGTH, function() {
        $(oThis.selectors.QUIZ_INSTRUCTIONS).fadeIn(oThis.ANIMATION_LENGTH);
        $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_HIDE).fadeIn(oThis.ANIMATION_LENGTH);
      });

      //
      event.preventDefault();
      return true;
    });

    //  Init the hide-instructions button
    $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_HIDE).click(function(event) {

      //
      $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_HIDE).fadeOut(oThis.ANIMATION_LENGTH, function() {
        $(oThis.selectors.QUIZ_INSTRUCTIONS).fadeOut(oThis.ANIMATION_LENGTH);
        $(oThis.selectors.QUIZ_INSTRUCTIONS_BUTTON_SHOW).fadeIn(oThis.ANIMATION_LENGTH);
      });

      //
      event.preventDefault();
    });
  };

  //  MakeQuiz::InitCancelButton()
  MakeQuiz.prototype.InitCancelButton = function InitCancelButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.CANCEL_BUTTON).click(function(event) {

      //
      $("#services").removeClass("hide");

      //
      oThis.ResetForm(function() {

        //
        oThis.pageMode.ClearMode();

        //  Scroll up again
        $("html, body").animate({
          scrollTop: $(document).height()
        }, "slow");

      });

      //
      event.preventDefault();
    });
  };

  //  MakeQuiz::InitAddQuestionButton()
  MakeQuiz.prototype.InitAddQuestionButton = function InitAddQuestionButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.ADD_NEW_QUESTION_BUTTON).click(function(event) {

      //
      var $question = oThis.CreateQuestion().hide();
      $(oThis.selectors.QUESTIONS_CONTAINER).first().append($question);
      $question.show(oThis.ANIMATION_LENGTH, function() {

        //
        $question.find(oThis.selectors.QUESTION_TITLE).focus();
        $("html, body").animate({
          scrollTop: $question.offset().top
        }, "slow");
      });

      //
      event.preventDefault();
    });
  };

  //  MakeQuiz::InitAddQuizResultCharacterButton()
  MakeQuiz.prototype.InitAddQuizResultCharacterButton = function InitAddQuizResultCharacterButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.ADD_NEW_QUIZ_RESULT_CHARACTER_BUTTON).click(function(event) {

      //
      var $character = oThis.CreateQuizResultCharacter();
      $character.hide();
      $(oThis.selectors.QUIZ_RESULT_CHARACTERS_CONTAINER).first().append($character);
      $character.show(oThis.ANIMATION_LENGTH, function() {
        $character.find(oThis.selectors.QUIZ_RESULT_CHARACTER_TITLE).focus();
        $("html, body").animate({
          scrollTop: $character.offset().top
        }, "slow");
      });

      //
      event.preventDefault();
    });
  };

  //  MakeQuiz::InitSubmitQuizButton()
  MakeQuiz.prototype.InitSubmitQuizButton = function InitSubmitQuizButton() {

    //
    var oThis = this;

    //
    $(oThis.selectors.SUBMIT_QUIZ_BUTTON).click(function() {
      //  Nothing needed yet
    });
  };

  //  MakeQuiz::HandleFormSubmission()
  MakeQuiz.prototype.HandleFormSubmission = function HandleFormSubmission() {

    //
    var oThis = this;

    //  Serialize into a dictionary
    var quiz = oThis.serializer.Serialize();

    //  Validate the quiz before we allow submission
    var validation_result = oThis.serializer.ValidateSerializedQuiz(quiz);
    if (validation_result !== true) {
      oThis.debug.DoError("Failed to validate quiz", validation_result);
      return;
    }

    //  Disable the submit button
    $(oThis.selectors.SUBMIT_QUIZ_BUTTON).attr("disabled", true);

    //  Create new quiz on server; Erase GUI if successful
    oThis.api.CreateNewQuiz(quiz, function(error) {

      //  Re-enable the submit button
      $(oThis.selectors.SUBMIT_QUIZ_BUTTON).attr("disabled", false);

      //  Error?
      if (error) {
        oThis.debug.DoError("Failed to create new quiz", error);
      } else {

        //  Reset the form
        oThis.ResetForm(function() {

          //  Clear the main page mode
          oThis.pageMode.ClearMode();

          //  Show the success message
          $(oThis.selectors.MAKE_QUIZ_SUCCESS_MESSAGE).fadeIn(oThis.ANIMATION_LENGTH, function() {

            //  Wait ten seconds, then disappear
            window.setTimeout(function() {
              $(oThis.selectors.MAKE_QUIZ_SUCCESS_MESSAGE).fadeOut(oThis.ANIMATION_LENGTH);
            }, 10000);
          });
        });
      }

    });
  };

  //  MakeQuiz::ResetForm(callback)
  MakeQuiz.prototype.ResetForm = function ResetForm(callback) {

    //
    var oThis = this;

    //  Start by removing the result characters
    $(oThis.selectors.QUIZ_RESULT_CHARACTERS_CONTAINER).hide(oThis.ANIMATION_LENGTH, function() {

      //
      $(oThis.selectors.QUIZ_RESULT_CHARACTERS_CONTAINER).html("").show();

      //  Next, remove the questions
      $(oThis.selectors.QUESTIONS_CONTAINER).hide(oThis.ANIMATION_LENGTH, function() {

        //
        $(oThis.selectors.QUESTIONS_CONTAINER).html("").show();

        //  Finally, clear the remaining form
        $(oThis.selectors.FORM)[0].reset();

        //  Call the callback, if any
        if (callback) {
          callback();
        }
      });
    });
  };

  //  MakeQuiz::CreateQuestion()
  MakeQuiz.prototype.CreateQuestion = function() {

    //
    var oThis = this;

    //  Determine this question's index
    var questions_count = $(oThis.selectors.QUESTIONS).length;
    var question_index = questions_count; //  Funny, innit?

    //  Main question container
    var q = $(document.createElement("li"));
    q.attr({
      "data-element-role": "question",
      "data-question-index": question_index
    });

    //  Base label for question
    var label_base = "Question #" + (question_index + 1);

    //  Question's Title
    q.append(

      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h2")).html(label_base + " - Title")
        ).append(
          $(document.createElement("input")).attr({
            "data-input-role": "question-title",
            "type": "text",
            "name": "title",
            "placeholder": "Title of this question here",
            "required": true
          }).keypress(event, function() {
            if (event.which == "13") {
              event.preventDefault();
            }
          })
        )
      )
    );

    //  Question's Text
    q.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h2")).html(label_base + " - Text")
        ).append(
          $(document.createElement("textarea")).attr({
            "data-input-role": "question-text",
            "name": "text",
            "placeholder": "ex: What would you do if blablabla ?",
            "required": true
          })
        )
      )
    );

    //  Question answers
    q.append(
      $(document.createElement("h1")).html(label_base + " - Answers")
    );
    var answers = $(document.createElement("ul"));
    answers.attr({
      "data-element-role": "answers"
    });
    //
    q.append(answers);
    //
    q.append(
      $(document.createElement("button")).html("Add Answer").attr({
        "data-button-role": "add-question-answer"
      }).addClass("btn btn-secondary").click(function(event) {
        var $answer = oThis.CreateQuestionAnswer(question_index, answers);
        $answer.hide();
        answers.append($answer);
        $answer.show(oThis.ANIMATION_LENGTH, function() {
          $answer.find(oThis.selectors.QUESTION_ANSWER_TEXT).focus();
          $("html, body").animate({
            scrollTop: $answer.offset().top
          }, "slow");
        });
        event.preventDefault();
      })
    );
    //
    q.append(
      $(document.createElement("button")).html("Delete " + label_base).attr({
        "data-button-role": "delete-question"
      }).addClass("btn btn-danger").click(function(event) {

        //
        var $button = $(this);

        //
        var $question_to_delete = $button.closest(oThis.selectors.QUESTION_CLOSEST);
        $question_to_delete.hide(oThis.ANIMATION_LENGTH, function() {
          $(this).remove();
        });

        //
        event.preventDefault();
      })
    );

    //  Separator
    q.append(
      $(document.createElement("hr"))
    );

    return q;
  };

  //  MakeQuiz::CreateQuestionAnswer(question_index, answers_container)
  MakeQuiz.prototype.CreateQuestionAnswer = function CreateQuestionAnswer(question_index, answers_container) {

    //
    var oThis = this;

    //  Determine this answer's index
    var answers_count = $(answers_container).find(oThis.selectors.QUESTION_ANSWERS).length;
    var answer_index = answers_count; //  lol

    //  Base label
    var label_base = "Question #" + (question_index + 1) + "; Answer #" + (answer_index + 1);

    //  Main container
    var a = $(document.createElement("li"));
    a.attr({
      "data-element-role": "answer",
      "data-answer-index": answer_index
    });

    //  A button to delete this answer
    var $button_delete = $(document.createElement("button")).html("Delete " + label_base).attr({
      "data-button-role": "delete-answer"
    }).addClass("btn btn-danger").click(function(event) {

      //
      var $button = $(this);

      //
      var $answer_to_delete = $button.closest(oThis.selectors.QUESTION_ANSWER_CLOSEST);
      $answer_to_delete.hide(oThis.ANIMATION_LENGTH, function() {
        $(this).remove();
      });

      //
      event.preventDefault();
    });

    //  Answer text
    a.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h3")).html(label_base + " - Text")
        ).append(
          $(document.createElement("textarea")).attr({
            "data-input-role": "question-answer-text",
            "name": "text",
            "placeholder": "ex: I would choose to eat the sandwich",
            "required": true
          })
        )
      )
    );

    //  Answer attribute modifiers
    a.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h3")).html(label_base + " - Attribute Modifiers")
        ).append(
          $(document.createElement("input")).attr({
            "data-input-role": "question-answer-attribute-modifiers",
            "name": "attribute_modifiers",
            "type": "text",
            "placeholder": "strength=+1;empathy=-5;courage=10;",
            "required": true,
            "pattern": oThis.attributeHelper.formFieldPatterns.ATTRIBUTE_MODIFIERS
          }).keypress(event, function() {
            if (event.which == "13") {
              event.preventDefault();
            }
          })
        )
      )
    );
    a.append(
      $(document.createElement("p")).addClass("hint").html(
        "Enter an alphanumeric attribute followed by \"=\", then an integer. Seperate multiple attributes with a semicolon."
      )
    );
    a.append(
      $(document.createElement("p")).addClass("hint").html("Example:").append(
        $(document.createElement("blockquote")).html("strength=+1;empathy=-5;courage=10;")
      )
    );

    //
    a.append($button_delete);

    //  Separator
    a.append(
      $(document.createElement("hr"))
    );

    return a;
  };

  //  MakeQuiz::CreateQuizResultCharacter()
  MakeQuiz.prototype.CreateQuizResultCharacter = function CreateQuizResultCharacter() {

    //
    var oThis = this;

    //  Determine next index
    var characters_count = $(oThis.selectors.QUIZ_RESULT_CHARACTERS).length;
    var character_index = characters_count; // lol

    //  Base label
    var label_base = "Quiz Result Character " + (character_index + 1);

    //  Main container
    var e = $(document.createElement("li"));
    e.attr({
      "data-element-role": "quiz-result-character",
      "data-character-index": character_index
    });

    //  Delete character button
    var $delete_button = $(document.createElement("button")).html("Delete " + label_base).attr({
      "data-button-role": "delete-quiz-result-character"
    }).addClass("btn btn-danger").click(function(event) {

      //
      var $button = $(this);

      //
      var $character_to_delete = $button.closest(oThis.selectors.QUIZ_RESULT_CHARACTER_CLOSEST);
      $character_to_delete.hide(oThis.ANIMATION_LENGTH, function() {
        $(this).remove();
      });

      //
      event.preventDefault();
    });

    //  Title
    e.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h2")).html(label_base + " - Title").append(

          )
        ).append(
          $(document.createElement("input")).attr({
            "data-element-role": "quiz-result-character-title",
            "type": "text",
            "name": "title",
            "placeholder": "ex: Spongebob",
            "required": true
          }).keypress(event, function() {
            if (event.which == "13") {
              event.preventDefault();
            }
          })
        )
      )
    );

    //  Description
    e.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h2")).html(label_base + " - Description")
        ).append(
          $(document.createElement("textarea")).attr({
            "data-element-role": "quiz-result-character-description",
            "name": "description",
            "placeholder": "ex: You are quirky and cute and annoying, yay!",
            "required": true
          })
        )
      )
    );

    //  Attributes
    e.append(
      $(document.createElement("div")).append(
        $(document.createElement("label")).append(
          $(document.createElement("h2")).html(label_base + " - Attributes")
        ).append(
          $(document.createElement("input")).attr({
            "data-element-role": "quiz-result-character-attributes",
            "type": "text",
            "name": "attributes",
            "placeholder": "cuteness=+10;tolerableness=-10;spongeyness=+100;",
            "required": true,
            "pattern": oThis.attributeHelper.formFieldPatterns.ATTRIBUTE_MODIFIERS
          }).keypress(event, function() {
            if (event.which == "13") {
              event.preventDefault();
            }
          })
        )
      )
    );

    //
    e.append($delete_button);

    //  Separator
    e.append(
      $(document.createElement("hr"))
    );

    return e;
  };

  //  MakeQuiz::Serializer(oMakeQuiz)
  MakeQuiz.prototype.Serializer = function Serializer(oMakeQuiz) {

    //
    this.makeQuiz = oMakeQuiz;
  };

  //  MakeQuiz::Serializer::Serialize()
  MakeQuiz.prototype.Serializer.prototype.Serialize = function Serialize() {

    //
    var oThis = this;
    var oMaker = this.makeQuiz;

    //  Dictionary with our finalized post data
    var data = {};

    //  Grab the quiz title and description
    data["title"] = $(oMaker.selectors.QUIZ_TITLE).first().val();
    data["description"] = $(oMaker.selectors.QUIZ_DESCRIPTION).first().val();

    //  Serialize all questions
    data["questions"] = oThis.SerializeQuestions();

    //  Serialize all quiz result characters
    data["characters"] = oThis.SerializeQuizResultCharacters();

    return data;
  };

  //  MakeQuiz::Serializer::SerializeQuestions()
  MakeQuiz.prototype.Serializer.prototype.SerializeQuestions = function SerializeQuestions() {

    //
    var oThis = this;
    var oMaker = this.makeQuiz;

    //  Dictionary to hold the data
    var questions = {};

    //  Grab all questions
    $(oMaker.selectors.QUESTIONS).each(function() {

      //
      var oQuestion = $(this);
      var question = {};

      //  Question index
      question["index"] = $(oQuestion).attr("data-question-index");

      //  Title / Description
      question["title"] = $(oQuestion).find(oMaker.selectors.QUESTION_TITLE).first().val();
      question["text"] = $(oQuestion).find(oMaker.selectors.QUESTION_TEXT).first().val();

      //  Answers
      question["answers"] = oThis.SerializeQuestionAnswers(oQuestion);

      //
      questions[question["index"]] = question;

    });

    return questions;
  };

  //  MakeQuiz::Serializer::SerializeQuestionAnswers(oQuestion)
  MakeQuiz.prototype.Serializer.prototype.SerializeQuestionAnswers = function SerializeQuestionAnswers(oQuestion) {

    //
    var oMaker = this.makeQuiz;
    //var oThis = this;

    //  Start data
    var data = {};

    //  Grab all answers
    var answers = $(oQuestion).find(oMaker.selectors.QUESTION_ANSWERS);

    //  Iterate through all answers
    $(answers).each(function() {

      //
      var oAnswer = $(this);
      var answer = {};

      //  Grab index
      answer["index"] = $(oAnswer).attr("data-answer-index");

      //  Text and attribute modifiers
      answer["text"] = $(oAnswer).find(oMaker.selectors.QUESTION_ANSWER_TEXT).val();
      answer["attribute_modifiers"] = $(oAnswer).find(oMaker.selectors.QUESTION_ANSWER_ATTRIBUTE_MODIFIERS).val();

      //
      data[answer["index"]] = answer;
    });

    return data;
  };

  //  MakeQuiz::Serializer::SerializeQuizResultCharacters()
  MakeQuiz.prototype.Serializer.prototype.SerializeQuizResultCharacters = function SerializeQuizResultCharacters() {

    //
    var oMaker = this.makeQuiz;
    //var oThis = this;

    //  Start data
    var data = {};

    //  Iterate over all entries
    var characters = $(oMaker.selectors.QUIZ_RESULT_CHARACTERS);
    $(characters).each(function() {

      //
      var oCharacter = $(this);
      var character = {};

      //  Index
      character["index"] = $(oCharacter).attr("data-character-index");

      //  Title, description, attributes
      character["title"] = $(oCharacter).find(oMaker.selectors.QUIZ_RESULT_CHARACTER_TITLE).first().val();
      character["description"] = $(oCharacter).find(oMaker.selectors.QUIZ_RESULT_CHARACTER_DESCRIPTION).first().val();
      character["attributes"] = $(oCharacter).find(oMaker.selectors.QUIZ_RESULT_CHARACTER_ATTRIBUTES).first().val();

      data[character["index"]] = character;
    });

    //
    return data;
  };

  //  MakeQuiz::Serializer::ValidateSerializedQuiz(quiz)
  MakeQuiz.prototype.Serializer.prototype.ValidateSerializedQuiz = function ValidateSerializedQuiz(quiz) {

    //
    var oMakeQuiz = this.makeQuiz;
    var errors = [];

    //
    if (!quiz) {
      errors.push("Invalid quiz object");
    }
    if (errors.length) {
      return errors;
    }

    //  Title and description are required
    if (!quiz.title) {
      errors.push("Quiz needs a title");
    }
    if (!quiz.description) {
      errors.push("Quiz needs a description");
    }

    //  Questions
    if (!quiz.questions || !Object.keys(quiz.questions).length) {
      errors.push("Quiz needs questions");
    } else {
      $.each(quiz.questions, function(question_index, question) {

        //
        var question_index_label = (parseInt(question_index) + 1);

        //
        if (!question) {
          errors.push("Question " + question_index_label + " is null");
        } else {
          if (!question.title) {
            errors.push("Question " + question_index_label + " needs a title");
          }
          if (!question.text) {
            errors.push("Question " + question_index_label + " needs body text");
          }
          if (!question.answers || !Object.keys(question.answers).length) {
            errors.push("Question " + question_index_label + " needs answers");
          } else {

            //
            $.each(question.answers, function(answer_index, answer) {

              //
              var answer_index_label = (parseInt(answer_index) + 1);

              //
              if (!answer) {
                errors.push("Question " + question_index_label + ", Answer " + answer_index_label + " is null");
              } else {
                if (!answer.text) {
                  errors.push("Question " + question_index_label + ", Answer " + answer_index_label + " needs body text");
                }
                if (!answer.attribute_modifiers) {
                  errors.push("Question " + question_index_label + ", Answer " + answer_index_label + " needs attribute modifiers");
                } else {
                  try {
                    oMakeQuiz.attributeHelper.ParseAttributes(answer.attribute_modifiers);
                  } catch (e) {
                    errors.push("Question " + question_index_label + ", Answer " + answer_index_label + " has invalid attribute modifiers");
                  }
                }
              }
            });
          }
        }
      });
    }

    //  Characters
    if (!quiz.characters || !Object.keys(quiz.characters).length) {
      errors.push("Quiz needs characters");
    } else {
      $.each(quiz.characters, function(character_index, character) {

        //
        var character_index_label = (parseInt(character_index) + 1);

        //
        if (!character.title) {
          errors.push("Character " + character_index_label + " needs a title");
        }
        if (!character.description) {
          errors.push("Character " + character_index_label + " needs a description");
        }
        if (!character.attributes) {
          errors.push("Character " + character_index_label + " needs attributes");
        } else {
          try {
            oMakeQuiz.attributeHelper.ParseAttributes(character.attributes);
          } catch (e) {
            errors.push("Character " + character_index_label + " has invalid attributes: " + character.attributes);
          }
        }
      });
    }

    if (errors.length) {
      return errors;
    }

    return true;
  };

  //  Assign our MakeQuiz class to the App
  window.App.MakeQuiz = MakeQuiz;
})();